import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Instrument_Serif } from "next/font/google";
import { AppMotionConfig } from "@/components/app-motion-config";
import { BfCacheViewportRevive } from "@/components/bf-cache-viewport-revive";
import { SnappyInPageAnchorClicks } from "@/components/snappy-in-page-anchor-clicks";
import { StripMainContentUrlHash } from "@/components/strip-main-content-url-hash";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans-geist",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display-instrument",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const siteUrl = getSiteUrl();
const defaultTitle = "Executive Recruitment | W3 Sourcing";
const defaultDescription =
  "Human-led executive search for VC-backed technology, legal, and banking & finance: principal judgment, discretion, and fit because tools cannot replace taste on who belongs in your leadership team. US, UK, EU, UAE, Asia.";

const ogImageAlt =
  "W3 Sourcing — executive recruitment in technology, legal, and banking";

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  manifest: "/images/favicon/site.webmanifest",
  icons: {
    shortcut: ["/images/favicon/favicon.ico"],
    icon: [
      { url: "/images/favicon/favicon.ico", sizes: "48x48" },
      {
        url: "/images/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  title: {
    default: defaultTitle,
    template: "%s | W3 Sourcing",
  },
  description: defaultDescription,
  applicationName: "W3 Sourcing",
  keywords: [
    "executive search",
    "executive recruitment",
    "VC recruitment",
    "venture capital recruitment",
    "VC-backed recruitment",
    "startup executive search",
    "tech recruitment",
    "technology recruitment",
    "legal recruitment",
    "banking recruitment",
    "finance recruitment",
    "headhunter",
    "London recruitment",
    "Singapore recruitment",
    "global recruitment",
  ],
  authors: [{ name: "W3 Sourcing", url: siteUrl.href }],
  creator: "W3 Sourcing",
  publisher: "W3 Sourcing",
  category: "business",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl.href,
    siteName: "W3 Sourcing",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/opengraph-image", alt: ogImageAlt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <Script src="/w3-theme-boot.js" strategy="beforeInteractive" />
      </head>
      <body className="liquid-page-canvas min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <AppMotionConfig>
            <BfCacheViewportRevive />
            <StripMainContentUrlHash />
            <SnappyInPageAnchorClicks />
            {children}
          </AppMotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
