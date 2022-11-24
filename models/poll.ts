import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    options: [{name: String, votes: Number}],
    end: Date
});

const Poll = mongoose.model("Poll", schema);