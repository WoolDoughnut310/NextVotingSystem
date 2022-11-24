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
        <div>
            {results.map((result) => (
                <button
                    key={result.name}
                    type="button"
                    onClick={() => onVote(result.name)}
                >
                    {result.name}
                </button>
            ))}
        </div>
    );
}
