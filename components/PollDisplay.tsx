import { Poll } from "models/Poll";
import { useRouter } from "next/router";
import React from "react";
import { User, MapPin } from "react-feather";

export default function PollDisplay({ data }: { data: Poll }) {
    const router = useRouter();

    const voters = Object.values(data.results).reduce(
        (acc, curr) => acc.length + curr.length
    );

    const options = Object.keys(data.results).length;

    const openPoll = () => {
        router.push(`/${data._id}`);
    };

    return (
        <div
            onClick={openPoll}
            className="rounded-xl border-gray-300 border-4 bg-slate-200 flex flex-col p-4 w-60 h-40 items-center justify-around hover:cursor-pointer"
        >
            <h3 className="text-xl font-semibold">{data.title}</h3>
            <span
                className="flex flex-row"
                title={`${options} options available`}
            >
                <MapPin className="mr-1" /> {options}
            </span>
            <span className="flex flex-row" title={`${voters} people voted`}>
                <User className="mr-1" /> {voters}
            </span>
        </div>
    );
}
