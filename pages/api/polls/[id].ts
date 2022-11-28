import type { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably/promises";
import Poll, { Poll as PollType } from "models/Poll";
import { getSession } from "lib/getSession";

const rest = new Ably.Rest(process.env.ABLY_API_KEY as string);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res);
    const { id } = req.query;

    const poll = await Poll.findById(id).exec();

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
            const { title, options, end } = req.body;

            let results = Object.fromEntries(
                options.map((option: string) => [option, []])
            );
            results = { ...results, ...poll.results };

            // Update to save votes for options
            const result = await Poll.findByIdAndUpdate(id, {
                title: title,
                results,
                end: new Date(end),
            }).exec();

            const channel = rest.channels.get(`polls:${id}`);
            await channel.publish("update-info", result);
            res.status(200).json(result);
            break;
        case "DELETE":
            await Poll.findByIdAndDelete(id).exec();
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export const config = {
    api: {
        externalResolver: false,
    },
};
