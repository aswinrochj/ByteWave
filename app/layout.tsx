import type { Metadata } from "next";
import { Sora, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SkillIntelligenceProvider } from "@/components/providers/SkillIntelligenceProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bytewave - Verified Skill Intelligence",
  description: "Stop hiring resumes. Start hiring intelligence. The first verified developer skill platform.",
  keywords: ["hiring", "developer assessment", "skill intelligence", "coding evaluation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} antialiased font-sans bg-black text-white`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="bytewave-ui-theme">
          <UserProvider>
            <PageTransitionProvider>
              <SkillIntelligenceProvider>
                {children}
              </SkillIntelligenceProvider>
            </PageTransitionProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
