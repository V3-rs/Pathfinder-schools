import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScaleKind AI | AI Automation for NGOs",
  description:
    "AI chatbots and CRM automation for NGOs and impact-driven organizations. Automate intake, donor follow-ups, and workflows. Serve more people without increasing headcount.",
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
