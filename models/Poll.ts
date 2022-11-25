import mongoose, { InferSchemaType } from "mongoose";
const { Schema, Types } = mongoose;

const pollSchema = new Schema({
    _id: Types.ObjectId,
    creator: { type: String, required: true },
    title: { type: String, required: true },
    results: { type: Map, of: Number, required: true },
    private: { type: Boolean, required: true, default: false },
    end: Date,
});

export type Poll = InferSchemaType<typeof pollSchema>;

export default mongoose.models.Poll || mongoose.model("Poll", pollSchema);
