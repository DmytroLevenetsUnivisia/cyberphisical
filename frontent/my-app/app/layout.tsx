export const dynamic = "force-dynamic";

import type {Metadata} from "next";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
    title: "SENSOR DASHBOARD",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <header className={`bg-gray-800`}>
                    <Navbar />
                </header>
                <main className={``}>{children}</main>
            </body>
        </html>
    );
}
