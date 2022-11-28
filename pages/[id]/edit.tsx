import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { Poll } from "models/Poll";
import PollEditForm from "components/PollEditForm";

const EditPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id;

    const onSubmit = async (data: Omit<Poll, "_id">) => {
        const response = await axios.put(`/api/polls/${router.query.id}`, data);
        const poll = response.data;
        router.push(`/${poll._id}`);
    };

    return (
        <div className="w-screen h-screen bg-slate-500 overflow-x-hidden">
            <Head>
                <title>Votr - Editing</title>
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
                <PollEditForm onSubmit={onSubmit} />
            </main>
        </div>
    );
};

//TODO

export default EditPage;
