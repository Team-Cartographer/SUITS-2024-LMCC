import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VignetteProvider } from "@/hooks/context/VignetteContext";

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
    <html lang="en" className="dark">
      <VignetteProvider>
        <body className={inter.className}>{children}</body>
      </VignetteProvider>
    </html>
  );
}
