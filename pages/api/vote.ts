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

    const results = Object.fromEntries(poll.results);
    console.log(results);

    if (!Object.keys(results).includes(option)) {
        res.status(400).json(`Invalid option "${option}"`);
        return;
    }

    if (results[option].includes(session.id)) {
        results[option] = results[option].filter(
            (voter: string) => voter !== session.id
        );
    } else {
        results[option].push(session.id);
    }

    await poll.update({ results });

    // Publish update to the channel
    const channel = rest.channels.get(`polls:${id}`);
    channel.publish("update-votes", results);

    res.status(200).end();
}
