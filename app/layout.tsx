import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
    <html
      lang="ko"
      className={`${inter.variable} ${notoSansKr.variable} ${notoSansJp.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface font-sans text-on-surface">
        {children}
      </body>
    </html>
  );
}
