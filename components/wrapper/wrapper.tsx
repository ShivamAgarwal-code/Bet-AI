"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/stories/Navbar";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  scroll,
  scrollSepolia,
} from "viem/chains";
import { WagmiProvider } from "wagmi";

export const config = getDefaultConfig({
  appName: "AI Betworks",
  projectId: `${process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID}`,
  chains: [avalanche, avalancheFuji, baseSepolia, base, scroll, scrollSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Toaster />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
            </ThemeProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
