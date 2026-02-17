import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Athena Lead Dashboard | More Life Consulting",
  description: "Lead tracking dashboard for Athena AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
