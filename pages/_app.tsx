import "../styles/globals.css";
import type { AppProps } from "next/app";
import { configureAbly } from "@ably-labs/react-hooks";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import { Analytics } from "@vercel/analytics/react";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const prefix = process.env.API_ROOT || "";

configureAbly({
    authUrl: `${prefix}/api/ably-token`,
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}
