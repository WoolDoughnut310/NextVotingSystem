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

    let title: string;
    let options: string[];
    let end: string;

    switch (req.method) {
        case "POST":
            ({ title, options, end } = req.body);

            const poll = new Poll({
                creator: session.id,
                title: title,
                results: options.map((option: string) => ({ name: option, votes: 0 })),
                end: new Date(end)
            });

            await poll.save();

            res.status(200).json("Created successfullly");
            break;
        case "UPDATE":
            ({ title, options, end } = req.body);


    }

