const mongoose = require("mongoose");
const { Schema } = mongoose;

const MONGODB_URI =
    "mongodb+srv://admin310:ZCKk0ENSDYOQgHBS@cluster0.bdmlq7t.mongodb.net/?retryWrites=true&w=majority";

const pollSchema = new Schema({
    creator: { type: String, required: true },
    title: { type: String, required: true },
    results: { type: Map, of: [String], required: true },
    privacy: { type: Boolean, required: true, default: false },
    end: Date,
});

const Poll = mongoose.model("Poll", pollSchema);

exports.Poll = Poll;
exports.mongoose = mongoose;
exports.URI = MONGODB_URI;
