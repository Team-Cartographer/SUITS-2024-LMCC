import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StopwatchProvider } from "@/components/providers/stopwatch_provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cartographer LMCC",
  description: "SUITS24 Team Cartographer LMCC App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
