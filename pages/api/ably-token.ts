import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "lib/getSession";
import Ably from "ably/promises";

const rest = new Ably.Rest(process.env.ABLY_API_KEY as string);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession(req, res);
    await session.commit();
    console.log("id2", session.id)

    const tokenParams = {
        clientId: session.id,
    };

    const tokenRequest = await rest.auth.createTokenRequest(tokenParams);
    res.status(200).json(tokenRequest);
}
