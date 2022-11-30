import "../styles/globals.css";
import type { AppProps } from "next/app";
import { configureAbly } from "@ably-labs/react-hooks";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

configureAbly({
    authUrl: `https://${process.env.VERCEL_URL as string}/api/ably-token`,
});

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
