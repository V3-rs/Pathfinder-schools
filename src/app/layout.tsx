import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathfinder — Discover Your Career Path",
  description: "Discover your path—connect aspirations to career possibilities with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <div className="animated-bg" />
        {children}
      </body>
    </html>
  );
}
