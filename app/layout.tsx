import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fire Research Collaboration Platform (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
