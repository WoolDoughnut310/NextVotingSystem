import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { PollPrimitive } from "models/Poll";
import PollEditForm from "components/PollEditForm";
import dbConnect from "lib/dbConnect";
import getPoll from "lib/getPoll";
import { format } from "date-fns";
import { getSession } from "lib/getSession";

const EditPage: NextPage<{ poll: PollPrimitive }> = ({ poll }) => {
    const router = useRouter();
    const id = router.query.id;

    const onSubmit = async (data: any) => {
        await axios.put(`/api/polls/${id}`, data);
        router.push(`/${id}`);
    };

    const end = new Date(poll.end);
    const time = format(end, "HH:mm");
    const date = format(end, "yyyy-MM-dd");
    const options = Object.keys(poll.results);

    const title = `Votr - Editing "${poll.title}"`;

    return (
        <div className="w-screen h-screen bg-slate-500 overflow-x-hidden">
            <Head>
                <title>{title}</title>
            </Head>
            <main
                className="
            p-5 flex flex-col
            justify-center items-center"
            >
                <h1
                    className="
                    font-bold text-4xl
                    text-center mb-5 text-gray-200"
                >
                    Edit Poll
                </h1>
                <PollEditForm
                    initialData={{
                        title: poll.title,
                        options,
                        privacy: poll.privacy,
                        time,
                        date,
                    }}
                    onSubmit={onSubmit}
                />
            </main>
        </div>
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

    if (poll.creator !== session.id) {
        return {
            redirect: {
                destination: `/${id}`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            poll,
        },
    };
};

export default EditPage;
