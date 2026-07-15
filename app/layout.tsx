import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://mockedin.com";
const siteDescription =
  "MockedIn is a free, fun tool to design and preview customizable, LinkedIn-style profile mockups for portfolios, presentations, and design work. Not affiliated with LinkedIn.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MockedIn — Design LinkedIn-Style Profile Mockups",
    template: "%s | MockedIn",
  },
  description: siteDescription,
  keywords: [
    "profile mockup",
    "LinkedIn mockup",
    "profile builder",
    "profile preview",
    "resume mockup",
    "portfolio mockup",
    "profile design tool",
    "fake profile generator",
    "profile template",
    "social profile mockup",
  ],
  applicationName: "MockedIn",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MockedIn — Design LinkedIn-Style Profile Mockups",
    description: siteDescription,
    url: siteUrl,
    siteName: "MockedIn",
    type: "website",
    // TODO: add OG image here later, e.g. `images: ["/og-image.png"]`, once the asset is ready.
  },
  twitter: {
    card: "summary_large_image",
    title: "MockedIn — Design LinkedIn-Style Profile Mockups",
    description: siteDescription,
    // TODO: add Twitter/social handle via `site`/`creator` and an image via `images` once ready.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  // TODO: add search engine verification codes once available, e.g.
  // verification: { google: "<google-site-verification-code>" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MockedIn",
  url: siteUrl,
  description: siteDescription,
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  disambiguatingDescription:
    "An independent profile mockup and preview tool. Not affiliated with, endorsed by, or connected to LinkedIn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
