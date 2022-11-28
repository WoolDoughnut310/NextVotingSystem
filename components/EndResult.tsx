import React from "react";
import { useAtomValue } from "jotai";
import { pollAtom } from "lib/store";
import { Award } from "react-feather";

export default function EndResult() {
    const { results } = useAtomValue(pollAtom);

    let winner: [string, string[]] = ["None", []];

    for (let [candidate, voters] of Object.entries(results)) {
        if (voters.length > winner.length) {
            winner = [candidate, voters];
        }
    }

    return (
        <div className="cursor-pointer w-80 rounded-xl px-6 py-4 border-2 border-gray-100 flex flex-col justify-center items-center bg-yellow-400 text-white">
            <Award className="w-10 h-10 mb-2" />
            <h2 className="text-2xl font-bold">
                Winner is <span>{winner[0]}</span>
            </h2>
        </div>
    );
}
