import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VignetteProvider } from "@/hooks/context/vignette-context";
import { NetworkProvider } from "@/hooks/context/network-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polaris LMCC",
  description: "Team Cartographer LMCC App, NASA SUITS 2024",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <NetworkProvider>
        <VignetteProvider>
          <body className={inter.className} suppressHydrationWarning={true}>{children}</body>
        </VignetteProvider>
      </NetworkProvider>
    </html>
  );
}
