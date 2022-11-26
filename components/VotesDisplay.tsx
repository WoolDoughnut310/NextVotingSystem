import React, { useMemo } from "react";
import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { idAtom, resultsAtom } from "lib/store";
import { useAtomValue } from "jotai";

const chartOptions: ChartOptions<"bar"> = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export default function VotesDisplay() {
    const id = useAtomValue(idAtom);
    const results = useAtomValue(resultsAtom);

    const chartData = useMemo<ChartData<"bar">>(() => {
        return {
            labels: Object.keys(results),
            datasets: [
                {
                    data: Object.values(results),
                    // borderWidth: 5,
                },
            ],
        };
    }, [results]);

    return <Bar data={chartData} options={chartOptions} />;
}
