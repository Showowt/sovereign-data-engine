import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sovereign Data Engine | MachineMind x Hernsted",
  description:
    "The blue ocean intelligence platform for real estate and annuity investors. 26+ data sources, behavioral intent scoring, timing intelligence.",
  keywords: [
    "real estate intelligence",
    "property data",
    "annuity investors",
    "behavioral scoring",
    "lead generation",
    "skip tracing",
    "probate leads",
    "foreclosure data",
    "PACER court records",
    "1031 exchange",
  ],
  authors: [{ name: "MachineMind" }],
  creator: "MachineMind x Hernsted Private Capital",
  publisher: "MachineMind",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sovereign-data-engine.vercel.app",
    siteName: "Sovereign Data Engine",
    title: "Sovereign Data Engine | Blue Ocean Intelligence",
    description:
      "26+ data sources. Behavioral intent scoring. Timing intelligence. The data layer nobody else has.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sovereign Data Engine - Blue Ocean Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sovereign Data Engine | Blue Ocean Intelligence",
    description:
      "26+ data sources. Behavioral intent scoring. Timing intelligence.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06050A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#06050A] text-[#E8E0D0]">
        {children}
      </body>
    </html>
  );
}
