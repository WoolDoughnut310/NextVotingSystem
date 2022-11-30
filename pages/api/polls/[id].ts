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

            let results = Object.fromEntries(
                options.map((option: string) => [option, []])
            );
            results = { ...results, ...Object.fromEntries(poll.results) };

            // Update to save votes for options
            await Poll.findByIdAndUpdate(id, {
                title: title,
                results,
                end: new Date(end),
                privacy,
            }).exec();

            // Query the database for the updated object
            poll = await Poll.findById(id).exec();

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

export const config = {
    api: {
        externalResolver: true,
    },
};
