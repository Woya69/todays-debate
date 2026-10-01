import type { Metadata, Viewport } from "next";
import { Libre_Bodoni, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { HomeAwareShell } from "@/components/home-aware-shell";
import { Analytics } from "@/components/analytics";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#eceef1",
};

const display = Libre_Bodoni({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const monoData = IBM_Plex_Mono({
  variable: "--font-mono-data",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — challenge someone. let the crowd decide.`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Challenge a friend to a structured debate. Throw short rounds. The crowd picks a corner, cheers, and comments. Daily main event always live.",
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
      className={`${display.variable} ${body.variable} ${monoData.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <HomeAwareShell header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </HomeAwareShell>
        <Analytics />
      </body>
    </html>
  );
}
