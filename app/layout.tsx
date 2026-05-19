import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monis — Design Your Workspace",
  description:
    "Configure and rent your perfect office setup. Choose desks, chairs, and accessories built for focused work.",
  openGraph: {
    title: "Monis — Design Your Workspace",
    description: "Interactive 3D office equipment rental configurator.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
