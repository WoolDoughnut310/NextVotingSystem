import React, { useMemo } from "react";
import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { pollAtom } from "lib/store";
import { useAtomValue } from "jotai";

const chartOptions: ChartOptions<"bar"> = {
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0,
            },
        },
    },
};

export default function VotesDisplay() {
    const { results } = useAtomValue(pollAtom);

    const chartData = useMemo<ChartData<"bar">>(() => {
        return {
            labels: Object.keys(results),
            datasets: [
                {
                    data: Object.values(results).map((voters) => voters.length),
                    borderWidth: 5,
                },
            ],
        };
    }, [results]);

    return <Bar data={chartData} options={chartOptions} updateMode="resize" />;
}
