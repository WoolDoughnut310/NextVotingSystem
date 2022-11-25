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

    if (poll.creator !== session.id) {
        res.status(403).end("Unauthorized access to poll");
        return;
    }

    switch (req.method) {
        case "PUT":
            const { title, options, end } = req.body;

            let results = Object.fromEntries(
                options.map((option: string) => [option, 0])
            );
            results = { ...results, ...poll.results };

            // Update to save votes for options
            await Poll.findByIdAndUpdate(id, {
                title: title,
                results,
                end: new Date(end),
            }).exec();

            res.status(200).json("Created successfullly");
            break;
        case "DELETE":
            await Poll.findByIdAndDelete(id).exec();
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
