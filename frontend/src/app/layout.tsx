import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./utilities.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByteWave | AI Skill Intelligence",
  description: "Measure logic, track growth, and connect to real hiring opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
