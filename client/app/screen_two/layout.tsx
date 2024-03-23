import Notifier from "@/components/ui/warning";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMCC (Screen 2)",
  description: "SUITS24 Team Cartographer LMCC App Screen 2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <Notifier />
      <body>{children}</body>
    </html>
  );
}
