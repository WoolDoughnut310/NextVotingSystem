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

    const results = poll.results;

    // If the user has voted for an option,
    // remove their vote from that option
    // and add their id to the new option
    for (let result of results) {
        if (result.name === option) {
            if (!result.votes.includes(session.id)) {
                result.votes.push(session.id);
            }
        } else if (result.votes.includes(session.id)) {
            result.votes = result.votes.filter((vote: string) => vote !== session.id);
        }
    }

    await poll.update({ results });

    // Publish update to the channel
    const channel = rest.channels.get(`polls:${id}`);
    channel.publish("update-votes", results)

    res.status(200).end();
}