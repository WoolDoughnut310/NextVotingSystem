import type { NextApiRequest, NextApiResponse } from "next";
import Poll from "models/Poll";
import { getSession } from "lib/getSession";
import dbConnect from "lib/dbConnect";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    await dbConnect();
    const session = await getSession(req, res);
    await session.commit();

    const { title, options, end, privacy } = req.body;

    const poll = new Poll({
        creator: session.id,
        title,
        results: options.map((option: string) => [option, []]),
        end: end && new Date(end),
        privacy,
    });

    await poll.save();
    res.status(200).json(poll);
}
