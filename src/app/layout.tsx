import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LIDYA FASHION - AI Personalized Fashion",
  description: "Experience fashion like never before with AI-powered personalization technology. See how clothes look on you before you buy.",
  keywords: ["AI Personalization", "Fashion", "AI", "E-commerce", "Clothes", "Shopping"],
  authors: [{ name: "LIDYA FASHION Team" }],
  openGraph: {
    title: "LIDYA FASHION - AI Personalized Fashion",
    description: "Experience fashion like never before with AI-powered personalization technology.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
