import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ImageKitProvider } from "@imagekit/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spinzonett.vercel.app"),
  title: {
    default: "SpinZone | Table Tennis Equipment & Gear",
    template: "%s | SpinZone",
  },
  description:
    "Discover quality table tennis equipment at SpinZone. Explore paddles, rubbers, balls, shoes, and accessories designed for every level of play.",
  applicationName: "SpinZone",
  keywords: [
    "SpinZone",
    "table tennis Nepal",
    "table tennis equipment",
    "table tennis bats",
    "table tennis paddles",
    "table tennis rubbers",
    "table tennis balls",
    "table tennis accessories",
  ],
  openGraph: {
    title: "SpinZone | Equipment for the Game You Love",
    description:
      "Find the right equipment to elevate your game. Explore quality table tennis gear at SpinZone.",
    siteName: "SpinZone",
    type: "website",
    locale: "en_US",
    url: "https://spinzonett.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpinZone | Equipment for the Game You Love",
    description:
      "Explore quality table tennis equipment and accessories at SpinZone.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ImageKitProvider
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
        >
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}
