import React, { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Poll, { Poll as PollType } from "../models/Poll";
import dbConnect from "lib/dbConnect";
import Head from "next/head";
import { useChannel } from "@ably-labs/react-hooks";
import { Provider, Atom } from "jotai";
import { idAtom, resultsAtom, sessionIdAtom } from "lib/store";
import { getSession } from "lib/getSession";

const PollPage: NextPage<{ data: PollType; sessionId: string }> = ({
    data,
    sessionId,
}) => {
    const [results, setResults] = useState(data.results);

    useChannel(`polls:${data._id}`, "update-votes", (message) => {
        setResults(message.data);
    });

    return (
        <Provider
            initialValues={
                [
                    [idAtom, data._id],
                    [resultsAtom, results],
                    [sessionIdAtom, sessionId],
                ] as Iterable<readonly [Atom<unknown>, unknown]>
            }
        >
            <div>
                <Head>
                    <title>{data.title}</title>
                </Head>
                <div>
                    Votes: <span>{JSON.stringify(results)}</span>
                </div>
            </div>
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
    const data = await Poll.findById(id).exec();

    if (!data) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            data: { ...data, _id: data._id.toString() },
            sessionId: session.id,
        },
    };
};

export default PollPage;
