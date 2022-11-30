import type { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably/promises";
import Poll from "models/Poll";
import { getSession } from "lib/getSession";

const rest = new Ably.Rest(process.env.ABLY_API_KEY as string);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const session = await getSession(req, res);
    await session.commit();

    const { id, option } = req.body;

    const poll = await Poll.findById(id).exec();

    if (!poll) {
        res.status(404).send("Cannot find poll at requested ID");
        return;
    }

    const results = Object.fromEntries(poll.results);

    if (!Object.keys(results).includes(option)) {
        res.status(400).json(`Invalid option "${option}"`);
        return;
    }

    let voters: string[];

    for (let candidate of Object.keys(results)) {
        voters = results[candidate];
        if (voters.includes(session.id)) {
            // Already voted, stop from voting again
            res.status(403).json(`Already voted for "${candidate}"`);
            return;
        }
    }

    results[option].push(session.id);

    await poll.updateOne({ results });

    // Publish update to the channel
    const channel = rest.channels.get(`polls:${id}`);
    channel.publish("update-votes", results);

    res.status(200).end();
}
