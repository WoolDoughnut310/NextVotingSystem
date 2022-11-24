import { atom } from "jotai";
import { Poll } from "models/Poll";

export const idAtom = atom("");
export const resultsAtom = atom<Poll["results"]>([]);
export const sessionIdAtom = atom("");
