import Poll, { PollPrimitive } from "models/Poll";

export default async function getPoll(
    id: string
): Promise<PollPrimitive | null> {
    const poll = await Poll.findById(id).lean();

    if (!poll) {
        return null;
    }

    poll._id = poll._id.toString();
    poll.end = poll.end.toString();

    return poll;
}
