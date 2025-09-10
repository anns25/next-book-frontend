import type { Metadata } from "next";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

import AuthCheck from "../components/AuthCheck";

export const metadata: Metadata = {
    title: "BookNook",
    description: "Online bookstore",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <AuthCheck />
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
