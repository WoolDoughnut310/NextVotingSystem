import "../styles/globals.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import type { AppProps } from "next/app";
import { configureAbly } from "@ably-labs/react-hooks";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

configureAbly({ authUrl: "http://localhost:3000/api/ably-token" });

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
