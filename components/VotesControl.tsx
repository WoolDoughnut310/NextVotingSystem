import React from "react";
import { useAtomValue } from "jotai";
import { pollAtom } from "lib/store";
import axios from "axios";

const COLOURS = [
    ["bg-red-400 hover:bg-red-300"],
    ["bg-yellow-400 hover:bg-yellow-300"],
    ["bg-green-400 hover:bg-green-300"],
    ["bg-blue-400 hover:bg-blue-300"],
    ["bg-orange-400 hover:bg-orange-300"],
];

export default function VotesControl() {
    const { _id: id, results } = useAtomValue(pollAtom);
    const onVote = (option: string) => {
        return axios.post("/api/vote", {
            id,
            option,
        });
    };

    return (
        <div className="mt-3 p-4 w-full grid gap-3 h-full ">
            {Object.keys(results).map((name, index) => {
                const colour = COLOURS[index % COLOURS.length];

                return (
                    <button
                        key={name}
                        type="button"
                        onClick={() => onVote(name)}
                        className={`h-32 ${colour} rounded-lg px-4 py-3 text-white border-gray-200 text-3xl`}
                    >
                        {name}
                    </button>
                );
            })}
        </div>
    );
}
