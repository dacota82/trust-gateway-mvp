import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trust Gateway MVP",
  description:
    "Contract → Evidence → Judgment 흐름으로 Agent 산출물을 사람이 검증하는 최소 게이트웨이",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface font-sans text-on-surface">
        {children}
      </body>
    </html>
  );
}
