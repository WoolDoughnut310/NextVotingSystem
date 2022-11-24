import React from "react";
import type { NextPage } from "next";
import Poll from "../../models/poll";

export default function Poll({data}) {
    
}

export const getServerSideProps = async (context) => {
    const id = context.params.id;

    const data = await Poll.findById(id).exec();

    return {
        props: { data }
    }
}