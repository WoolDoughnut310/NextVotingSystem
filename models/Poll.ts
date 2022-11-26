import mongoose, { InferSchemaType } from "mongoose";
const { Schema } = mongoose;

const pollSchema = new Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true },
    results: { type: Map, of: [String], required: true },
    private: { type: Boolean, required: true, default: false },
    end: { type: Date, required: true },
});

export type Poll = InferSchemaType<typeof pollSchema> & { _id: string };

export default mongoose.models.Poll<Poll> || mongoose.model("Poll", pollSchema);
