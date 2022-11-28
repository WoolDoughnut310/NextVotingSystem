import mongoose, { InferSchemaType, Model } from "mongoose";
const { Schema } = mongoose;

const pollSchema = new Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true },
    results: { type: Map, of: [String], required: true },
    privacy: { type: Boolean, required: true, default: false },
    end: { type: Date, required: true },
});

export type Poll = InferSchemaType<typeof pollSchema> & { _id: string };
export type PollPrimitive = Omit<Omit<Poll, "end">, "results"> & {
    end: string;
    results: { [key: string]: string[] };
};

export default mongoose.models.Poll || mongoose.model("Poll", pollSchema);
