import { useRouter } from "next/router";
import React from "react";
import { Plus, Filter } from "react-feather";

export default function AppBar() {
    const router = useRouter();

    const viewingPersonal = router.query.personal === "true";

    const openYourPolls = () => {
        const newUrl = `/?personal=${(!viewingPersonal).toString()}`;
        router.replace(newUrl, newUrl);
    };

    const openCreate = () => {
        router.push("/new");
    };

    return (
        <header className="py-6 px-5 h-20 w-full border-b-2 border-b-gray-300 flex flex-row justify-between">
            <h1 className="text-3xl font-bold">VotR</h1>
            <div className="flex flex-row justify-center space-x-3">
                <button
                    onClick={openYourPolls}
                    type="button"
                    className="bg-blue-500 rounded-xl border-white border-2 h-10 px-2 text-white"
                >
                    <Filter className="inline mr-2" />
                    {viewingPersonal ? "All Polls" : "Your Polls"}
                </button>
                <button
                    onClick={openCreate}
                    type="button"
                    className="bg-blue-500 rounded-xl border-white border-2 h-10 px-2 text-white"
                >
                    <Plus className="inline mr-2" />
                    Create
                </button>
            </div>
        </header>
    );
}
