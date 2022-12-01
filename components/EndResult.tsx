import React from "react";
import { useAtomValue } from "jotai";
import { pollAtom } from "lib/store";
import { Award } from "react-feather";

const listFormatter = new Intl.ListFormat("en");

export default function EndResult() {
    const { results } = useAtomValue(pollAtom);

    let winningVotes = 0;
    let winners: string[] = [];

    for (let [candidate, voters] of Object.entries(results)) {
        if (voters.length > winningVotes) {
            winningVotes = voters.length;
            winners = [candidate];
        } else if (voters.length === winningVotes) {
            winners.push(candidate);
        }
    }

    const isDraw = winners.length > 1;
    const bgColor = isDraw ? "bg-slate-400" : "bg-yellow-400";

    let message: string;

    if (winners.length === Object.keys(results).length) {
        message = "Nobody wins. It's a draw!";
    } else if (isDraw) {
        message = `It's a tie between ${listFormatter.format(winners)}`;
    } else {
        message = `Winner is ${winners[0]}`;
    }

    return (
        <div
            className={`cursor-pointer w-80 rounded-xl px-6 py-4 border-2 border-gray-100 flex flex-col justify-center items-center ${bgColor} text-white`}
        >
            <Award className="w-10 h-10 mb-2" />
            <h2 className="text-2xl font-bold text-center">{message}</h2>
        </div>
    );
}
