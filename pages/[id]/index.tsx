import React, { useEffect, useMemo } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { PollPrimitive } from "../../models/Poll";
import dbConnect from "lib/dbConnect";
import Head from "next/head";
import { useChannel } from "@ably-labs/react-hooks";
import { useAtom } from "jotai";
import { pollAtom, sessionIdAtom } from "lib/store";
import { getSession } from "lib/getSession";
import VotesDisplay from "components/VotesDisplay";
import VotesControl from "components/VotesControl";
import { Clipboard, Edit2, Home, Trash } from "react-feather";
import { useRouter } from "next/router";
import { differenceInMinutes } from "date-fns";
import EndResult from "components/EndResult";
import getPoll from "lib/getPoll";
import axios from "axios";

const PollPage: NextPage<{ poll: PollPrimitive; sessionId: string }> = (
    props
) => {
    const router = useRouter();
    const [sessionId, setSessionId] = useAtom(sessionIdAtom);
    const [poll, setPoll] = useAtom(pollAtom);

    const hasVoted = useMemo(() => {
        console.log("id1", sessionId);
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
        setPoll((oldValue: PollPrimitive) => ({
            ...oldValue,
            results: message.data,
        }));
    });

    useChannel(`polls:${poll._id}`, "update-info", (message) => {
        setPoll(message.data);
    });

    const onDelete = async () => {
        //TODO Add confirmation
        await axios.delete(`api/polls/${poll._id}`);
        router.push("/");
    };

    const isCreator = poll.creator === sessionId;
    const hasEnded = differenceInMinutes(new Date(), new Date(poll.end)) > 0;
    const showDisplay = hasEnded || isCreator || hasVoted;

    return (
        <>
            <Head>
                <title>{poll.title}</title>
            </Head>
            <div className="w-full flex flex-row justify-between absolute top-0 left-0 space-x-3 p-4">
                <div className="flex flex-row space-x-3">
                    <button
                        type="button"
                        title="Go home"
                        onClick={() => router.push("/")}
                        className="p-3 rounded-full bg-blue-300 hover:ring"
                    >
                        <Home className="text-white" />
                    </button>
                    {isCreator && (
                        <button
                            type="button"
                            title="Open edit page"
                            onClick={() => router.push(`/${poll._id}/edit`)}
                            className="p-3 rounded-full bg-blue-300 hover:ring"
                        >
                            <Edit2 className="text-white" />
                        </button>
                    )}
                </div>
                <div className="flex flex-row space-x-3">
                    <button
                        type="button"
                        title="Copy the link to this poll"
                        onClick={() =>
                            navigator.clipboard.writeText(window.location.href)
                        }
                        className="p-3 rounded-full bg-blue-300 hover:ring active:scale-90"
                    >
                        <Clipboard className="text-white" />
                    </button>
                    {isCreator && (
                        <button
                            type="button"
                            title="Delete this poll"
                            onClick={onDelete}
                            className="p-3 rounded-full bg-red-300 hover:ring ring-fuchsia-400"
                        >
                            <Trash className="text-white" />
                        </button>
                    )}
                </div>
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
    const session = await getSession(req, res);
    await session.commit();

    await dbConnect();
    const id = params?.id as string;
    const poll = await getPoll(id);

    if (!poll) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            poll,
            sessionId: session.id,
        },
    };
};

export default PollPage;
