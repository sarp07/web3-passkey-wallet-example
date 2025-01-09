import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Passkey Wallet",
  description: "Web3 Passkey Wallet System - Güvenli ve Kolay Kullanımlı Web3 Cüzdan",
  keywords: ["web3", "wallet", "passkey", "blockchain", "crypto"],
  authors: [{ name: "Passkey Wallet" }],
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  themeColor: "#4a8cff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Passkey Wallet",
  },
  openGraph: {
    title: "Passkey Wallet",
    description: "Web3 Passkey Wallet System - Güvenli ve Kolay Kullanımlı Web3 Cüzdan",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passkey Wallet",
    description: "Web3 Passkey Wallet System - Güvenli ve Kolay Kullanımlı Web3 Cüzdan",
  },
  icons: {
    icon: "/thirdweb.svg",
    apple: "/thirdweb.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
