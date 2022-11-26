import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { PlusSquare, XCircle } from "react-feather";
import axios from "axios";
import { format, differenceInMinutes } from "date-fns";
import { useRouter } from "next/router";

const TitleInput = ({
    title,
    setTitle,
}: {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}) => (
    <div className="flex flex-col w-full">
        <label className="font-bold text-sm mb-2" htmlFor="title">
            Title
        </label>
        <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="
                rounded-xl bg-transparent
                focus:border-indigo-300 focus:ring
                focus:ring-indigo-200 focus:ring-opacity-50"
        />
    </div>
);

const DateTimeInput = ({
    date,
    time,
    setDate,
    setTime,
}: {
    date: string;
    time: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
    setTime: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const timeInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!timeInput.current) return;

        const now = new Date();

        const [hours, minutes] = time.split(":");
        const newDateTime = new Date(date).setHours(
            parseInt(hours),
            parseInt(minutes)
        );

        if (differenceInMinutes(newDateTime, now) < 5) {
            timeInput.current.setCustomValidity(
                "Time set must be at least 5 minutes from now"
            );
            timeInput.current.reportValidity();
        } else {
            timeInput.current.setCustomValidity("");
        }
    }, [date, time]);

    return (
        <div className="flex flex-col w-full">
            <label className="font-bold text-sm mb-2">End Date & Time</label>
            <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="mb-2 bg-white/50 h-12 rounded-xl focus:ring-gray-400 text-gray-800"
            />
            <input
                required
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                ref={timeInput}
                className="bg-white/50 h-12 rounded-xl focus:ring-gray-400 text-gray-800"
            />
        </div>
    );
};

const OptionsInput = ({
    options,
    setOptions,
}: {
    options: string[];
    setOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    const removeOption = (index: number) => {
        setOptions((oldOptions) => {
            const newOptions = [...oldOptions];
            newOptions.splice(index, 1);
            return newOptions;
        });
    };

    const updateOption = (index: number, newValue: string) => {
        console.log(index, newValue);
        setOptions((oldOptions) => {
            const newOptions = [...oldOptions];
            newOptions.splice(index, 1, newValue);
            return newOptions;
        });
    };

    return (
        <div className="flex flex-col w-full">
            <label className="font-bold text-sm mb-2">Options</label>
            <div className="flex flex-col space-y-2">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className="
                            px-4 py-1 w-full rounded-xl
                            bg-white/50 border-gray-300
                            border-4 flex flex-row items-center
                            justify-between"
                    >
                        <input
                            type="text"
                            value={option}
                            required
                            className="
                                mt-0 border-0 bg-transparent
                                focus:ring-0 flex-1 text-gray-800"
                            onChange={(event) =>
                                updateOption(index, event.target.value)
                            }
                        />
                        <button
                            disabled={options.length === 1}
                            onClick={() => {
                                removeOption(index);
                            }}
                            type="button"
                            title={
                                options.length === 1
                                    ? "Poll must have at least one option"
                                    : "Remove option"
                            }
                            className="
                                        mx-2 bg-slate-800/80
                                        disabled:bg-slate-800/60
                                        rounded-lg p-2 h-fit w-fit"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={() => setOptions((oldOptions) => [...oldOptions, ""])}
                type="button"
                title="Add option"
                className="
                            group mt-3 py-2 w-full
                            rounded-xl bg-white/70
                            border-white focus:border-blue-400
                            focus:ring"
            >
                <PlusSquare
                    className="
                            mx-auto text-gray-400
                            group-hover:text-gray-500"
                />
            </button>
        </div>
    );
};

const PrivacyInput = ({
    privacy,
    setPrivacy,
}: {
    privacy: boolean;
    setPrivacy: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
    <div className="flex flex-row w-full items-center">
        <label htmlFor="privacy" className="font-bold text-sm mr-2">
            Private
        </label>
        <input
            type="checkbox"
            id="privacy"
            title="Display poll on listing page"
            checked={privacy}
            onChange={(event) => setPrivacy(event.target.checked)}
            className="focus:ring-0 active:ring-0 focus:border-0 rounded-xl w-8 h-6"
        />
    </div>
);

const NewPage: NextPage = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState([""]);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [privacy, setPrivacy] = useState(false);

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const [hours, minutes] = time.split(":");
        const end = new Date(date).setHours(parseInt(hours), parseInt(minutes));

        const response = await axios.post("/api/polls", {
            title,
            options,
            end,
            private: privacy,
        });

        const data = response.data;

        router.push(`/${data._id}`);
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
                <form
                    onSubmit={onSubmit}
                    className="
                    bg-gray-200/30
                    rounded-lg
                    border-gray-50
                    border-2 px-6 py-3
                    text-gray-200 w-96
                    min-h-[500px] shadow-lg
                    flex flex-col
                    items-center space-y-4"
                >
                    <TitleInput title={title} setTitle={setTitle} />
                    <DateTimeInput
                        date={date}
                        setDate={setDate}
                        time={time}
                        setTime={setTime}
                    />
                    <OptionsInput options={options} setOptions={setOptions} />
                    <PrivacyInput privacy={privacy} setPrivacy={setPrivacy} />
                    <button
                        type="submit"
                        className="self-end rounded-2xl p-3 font-bold font-mono1 bg-gray-600 hover:bg-gray-700 focus:ring focus:border-indigo-500"
                    >
                        Submit
                    </button>
                </form>
            </main>
        </div>
    );
};

export default NewPage;
