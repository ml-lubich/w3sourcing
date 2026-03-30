import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "W3 Sourcing — Global Recruitment for Tech, Legal & Finance",
  description:
    "W3 Sourcing connects exceptional talent with world-class organisations across Tech, Legal, and Finance. Offices in London and Singapore.",
  keywords: [
    "recruitment",
    "tech recruitment",
    "legal recruitment",
    "finance recruitment",
    "executive search",
    "London",
    "Singapore",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
