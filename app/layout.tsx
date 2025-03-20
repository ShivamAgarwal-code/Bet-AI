"use client";

import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/stories/Navbar";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import {
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  scroll,
  scrollSepolia,
  sonicBlazeTestnet,
} from "viem/chains";
import { WagmiProvider } from "wagmi";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = getDefaultConfig({
  appName: "AI Betworks",
  projectId: `${process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID}`,
  chains: [
    avalanche,
    avalancheFuji,
    sonicBlazeTestnet,
    base,
    baseSepolia,
    scroll,
    scrollSepolia,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster />
                <Navbar />
                {children}
              </ThemeProvider>
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
