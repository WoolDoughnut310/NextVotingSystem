import type { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably/promises";
import Poll from "models/Poll";
import { getSession } from "lib/getSession";

const rest = new Ably.Rest(process.env.ABLY_API_KEY as string);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res);
    const { id, option } = req.body;

    const poll = await Poll.findById(id).exec();

    if (!poll) {
        res.status(404).send("Cannot find poll at requested ID");
        return;
    }

    console.log(session.id);

    const results = Object.fromEntries(poll.results);

    if (!Object.keys(results).includes(option)) {
        res.status(400).json(`Invalid option "${option}"`);
        return;
    }

    let voters: string[];

    for (let candidate of Object.keys(results)) {
        voters = results[candidate];
        if (voters.includes(session.id)) {
            console.log("removing vote from", candidate);
            results[candidate] = results[candidate].filter(
                (voter: string) => voter !== session.id
            );
        }

        if (candidate === option) {
            console.log("adding vote");
            results[candidate].push(session.id);
        }
    }

    await poll.updateOne({ results });

    // Publish update to the channel
    const channel = rest.channels.get(`polls:${id}`);
    channel.publish("update-votes", results);

    res.status(200).end();
}

export const config = {
    api: {
        externalResolver: false,
    },
};
