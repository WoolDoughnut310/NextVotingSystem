import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { idAtom, resultsAtom, sessionIdAtom } from "lib/store";
import axios from "axios";

export default function VotesControl() {
    const id = useAtomValue(idAtom);
    const [results, setResults] = useAtom(resultsAtom);
    const sessionId = useAtomValue(sessionIdAtom);

    const onVote = (option: string) => {
        return axios.post("/api/vote", {
            id,
            option,
        });
    };

    return (
        <div className="mt-3 p-4 w-full grid gap-3 h-full ">
            {Object.keys(results).map((name) => (
                <button
                    key={name}
                    type="button"
                    onClick={() => onVote(name)}
                    className="h-32 bg-slate-400 hover:bg-slate-300 rounded-lg px-4 py-3 text-white border-gray-200 text-3xl"
                >
                    {name}
                </button>
            ))}
        </div>
    );
}
