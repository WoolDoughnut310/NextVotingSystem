import React, { useEffect, useMemo } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Poll, { PollPrimitive } from "../../models/Poll";
import dbConnect from "lib/dbConnect";
import Head from "next/head";
import { useChannel } from "@ably-labs/react-hooks";
import { useAtom } from "jotai";
import { pollAtom, sessionIdAtom } from "lib/store";
import { getSession } from "lib/getSession";
import VotesDisplay from "components/VotesDisplay";
import VotesControl from "components/VotesControl";
import { Edit2, Home } from "react-feather";
import { useRouter } from "next/router";
import { differenceInMinutes } from "date-fns";
import EndResult from "components/EndResult";

const PollPage: NextPage<{ poll: PollPrimitive; sessionId: string }> = (
    props
) => {
    const router = useRouter();
    const [sessionId, setSessionId] = useAtom(sessionIdAtom);
    const [poll, setPoll] = useAtom(pollAtom);

    const hasVoted = useMemo(() => {
        for (let voters of Object.values(poll.results)) {
            if (voters.includes(sessionId)) {
                return true;
            }
        }
        return false;
    }, [poll, sessionId]);

    useEffect(() => {
        setPoll(props.poll);
        setSessionId(props.sessionId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useChannel(`polls:${poll._id}`, "update-votes", (message) => {
        console.log("got update", message);
        setPoll((oldValue: PollPrimitive) => ({
            ...oldValue,
            results: message.data,
        }));
    });

    useChannel(`polls:${poll._id}`, "update-info", (message) => {
        console.log("info update", message);
        setPoll(message.data);
    });

    const isCreator = poll.creator === sessionId;
    const hasEnded = differenceInMinutes(Date.now(), new Date(poll.end)) < 0;
    const showDisplay = hasEnded || isCreator || hasVoted;

    return (
        <>
            <Head>
                <title>{poll.title}</title>
            </Head>
            <div className="flex flex-row absolute top-4 left-4 space-x-3">
                <button
                    type="button"
                    title="Go home"
                    onClick={() => router.push("/")}
                    className="p-3 rounded-full bg-blue-300 hover:ring"
                >
                    <Home className="text-white" />
                </button>
                {!isCreator && (
                    <button
                        type="button"
                        title="Open edit page"
                        onClick={() => router.push("/edit")}
                        className="p-3 rounded-full bg-blue-300 hover:ring"
                    >
                        <Edit2 className="text-white" />
                    </button>
                )}
            </div>
            <main className="p-5 h-screen w-screen flex flex-col">
                <h1 className="font-bold text-4xl text-center my-5 underline">
                    {poll.title}
                </h1>
                <div className="px-5 flex-1 flex flex-col justify-center items-center">
                    {showDisplay ? <VotesDisplay /> : <VotesControl />}
                    {hasEnded && <EndResult />}
                </div>
            </main>
        </>
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
