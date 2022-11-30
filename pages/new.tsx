import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import PollEditForm from "components/PollEditForm";

const NewPage: NextPage = () => {
    const router = useRouter();

    const onSubmit = async (data: any) => {
        const response = await axios.post("/api/polls", data);
        const poll = response.data;
        router.push(`/${poll._id}`);
    };

    return (
        <div className="w-screen h-screen bg-slate-500 overflow-x-hidden">
            <Head>
                <title>Votr - New Poll</title>
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
                    New Poll
                </h1>
                <PollEditForm onSubmit={onSubmit} />
            </main>
        </div>
    );
};

export default NewPage;
