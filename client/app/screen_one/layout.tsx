import Notifier from "@/components/ui/warning";
import type { Metadata } from "next";
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
      <html lang="en" className="dark">
        <Notifier />
        <body>{children}</body>
      </html>
  );
}
