import { atom } from "jotai";
import { PollPrimitive } from "models/Poll";

interface A {
    m: Map<string, string>;
}

export const pollAtom = atom<PollPrimitive>({
    _id: "",
    creator: "",
    title: "",
    results: {},
    privacy: false,
    end: "",
});
export const sessionIdAtom = atom("");
