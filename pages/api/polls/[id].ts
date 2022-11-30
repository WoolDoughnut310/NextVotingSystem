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
    await session.commit();

    const { id } = req.query;

    let poll = await Poll.findById(id).exec();

    if (!poll) {
        res.status(404).send("Cannot find poll at requested ID");
        return;
    }

    if (poll.creator !== session.id) {
        res.status(403).end("Unauthorized access to poll");
        return;
    }

    switch (req.method) {
        case "PUT":
            const { title, options, end, privacy } = req.body;

            // Any new options will have empty arrays, but
            // existing options requested will be overwritten
            // by their previous value
            let results = Object.fromEntries(
                options.map((option: string) => [option, []])
            );
            results = { ...results, ...Object.fromEntries(poll.results) };

            poll.title = title;
            poll.results = results;
            poll.end = new Date(end);
            poll.privacy = privacy;

            // Save the updated document and return it
            poll = await poll.save();

            const channel = rest.channels.get(`polls:${id}`);
            await channel.publish("update-info", poll);
            res.status(200).end();
            break;
        case "DELETE":
            await Poll.findByIdAndDelete(id).exec();
            res.status(200).end();
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
