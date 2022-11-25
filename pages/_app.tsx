import "../styles/globals.css";
import type { AppProps } from "next/app";
import { configureAbly } from "@ably-labs/react-hooks";

configureAbly({ authUrl: "http://localhost:3000/api/ably-token" });

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
