import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const roboticFont = Orbitron({
  variable: "--font-robotic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const uiFont = Orbitron({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const monoFont = Orbitron({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Tamogh | ML Engineer",
  description:
    "Machine Learning Engineer — building intelligent systems at the intersection of research and production.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboticFont.variable} ${uiFont.variable} ${monoFont.variable}`} style={{ background: "var(--bg-primary)" }}>
      <body className={roboticFont.className}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
