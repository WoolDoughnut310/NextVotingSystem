import React, { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Poll, { Poll as PollType } from "../models/Poll";
import dbConnect from "lib/dbConnect";
import Head from "next/head";
import { useChannel } from "@ably-labs/react-hooks";
import { Provider, Atom } from "jotai";
import { idAtom, resultsAtom, sessionIdAtom } from "lib/store";
import { getSession } from "lib/getSession";
import VotesDisplay from "components/VotesDisplay";
import VotesControl from "components/VotesControl";
import { Home } from "react-feather";
import { useRouter } from "next/router";

const PollPage: NextPage<{ poll: PollType; sessionId: string }> = ({
    poll,
    sessionId,
}) => {
    const router = useRouter();
    const [results, setResults] = useState(poll.results);

    useChannel(`polls:${poll._id}`, "update-votes", (message) => {
        setResults(message.data);
    });

    return (
        <Provider
            initialValues={
                [
                    [idAtom, poll._id],
                    [resultsAtom, results],
                    [sessionIdAtom, sessionId],
                ] as Iterable<readonly [Atom<unknown>, unknown]>
            }
        >
            <Head>
                <title>{poll.title}</title>
            </Head>
            <button
                type="button"
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 p-3 rounded-full bg-blue-300 hover:ring"
            >
                <Home className="text-white" />
            </button>
            <main className="p-5 h-screen w-screen flex flex-col">
                <h1 className="font-bold text-4xl text-center my-5 underline">
                    {poll.title}
                </h1>
                <div className="px-5 flex-1 flex flex-col justify-center items-center">
                    {/* <VotesDisplay /> */}
                    {/* Change to !== */}
                    {poll.creator !== sessionId && <VotesControl />}
                </div>
            </main>
        </Provider>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    params,
    req,
    res,
}) => {
    await dbConnect();
    const session = await getSession(req, res);

    const id = params?.id;
    const poll = await Poll.findById(id).lean();

    if (!poll) {
        return {
            notFound: true,
        };
    }

    poll._id = poll._id.toString();
    poll.end = poll.end.toString();

    return {
        props: {
            poll,
            sessionId: session.id,
        },
    };
};

export default PollPage;
