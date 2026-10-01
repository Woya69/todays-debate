import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, Spline_Sans_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Analytics } from "@/components/analytics";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#e9e2d2",
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const monoData = Spline_Sans_Mono({
  variable: "--font-mono-data",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — one motion, both sides, daily`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "A daily op-ed duel. Take a side, read the strongest case for and against, predict the room, then cast your verdict.",
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${monoData.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
