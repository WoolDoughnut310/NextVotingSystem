import type { NextApiRequest, NextApiResponse } from "next";
import Poll from "models/Poll";
import { getSession } from "lib/getSession";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res);
    await session.commit();

    if (req.method !== "POST") {
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { title, options, end, privacy } = req.body;

    const poll = new Poll({
        creator: session.id,
        title: title,
        results: options.map((option: string) => [option, []]),
        end: end && new Date(end),
        privacy,
    });

    await poll.save();
    res.status(200).json(poll);
}

export const config = {
    api: {
        externalResolver: true,
    },
};
