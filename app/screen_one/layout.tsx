import type { Metadata } from "next";
import { StopwatchProvider } from "@/components/providers/stopwatch_provider";

export const metadata: Metadata = {
  title: "LMCC (Screen 1)",
  description: "SUITS24 Team Cartographer LMCC App Screen 1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StopwatchProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </StopwatchProvider>
  );
}
