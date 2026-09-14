import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "HyuuCdn — Neo-Brutalist File Storage & Developer REST API",
  description:
    "Fast, high-performance temporary (7-day) and permanent file CDN with Neo-Brutalism UI, Supabase Storage, and REST API automation.",
  keywords: [
    "CDN",
    "File Uploader",
    "Neo Brutalism",
    "REST API",
    "Supabase Storage",
    "Developer Tools",
    "Next.js",
  ],
  authors: [{ name: "Slowly / Hyuu" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8F6F0] bg-grid-brutal selection:bg-[#FFD028] selection:text-black">
        <Preloader />
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
