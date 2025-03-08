import type {Metadata} from "next";
// import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Providers} from "@/app/Providers";
import {Header} from "@/Components/Header";
import ClientAuthProvider from "../../backend/Auth/ClientAuthProvider";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`antialiased bg-white mx-auto max-w-6xl flex flex-col gap-6 p-2 xl:p-0 xl:pb-4`}
        >
        <ClientAuthProvider domain={process.env.NEXT_AUTH0_DOMAIN!} clientId={process.env.NEXT_AUTH0_CLIENT_ID!}>
            <Header/>
            <Providers>
                {children}
            </Providers>
        </ClientAuthProvider>
        </body>
        </html>
    );
}
