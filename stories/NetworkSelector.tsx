"use client";

import { SupportedChains } from "@/lib/consts";
import { scroll, scrollSepolia } from "viem/chains";
import { ChainButton } from "./ChainButton";
import scrollFullIcon from "./assets/crypto/scroll-full-black.svg";

interface NetworkSelectorProps {
  selectedChain: SupportedChains | undefined;
  onChainSelect: (chain: SupportedChains) => void;
  className?: string;
}

export function NetworkSelector({
  selectedChain,
  onChainSelect,
  className,
}: NetworkSelectorProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div>
        <div className="font-medium text-green-300">Testnet</div>
        {/* <ChainButton
          iconUrl={baseFullIcon.src}
          selected={selectedChain.id === base.id}
          className="bg-[#0052FF] w-full h-[60px]"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(base)}
        />
        <ChainButton
          iconUrl={avalancheFullIcon.src}
          selected={selectedChain.id === avalanche.id}
          className="bg-[#DF3F3E] w-full h-[60px] mt-4"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(avalanche)}
        /> */}
        {/* <ChainButton
          iconUrl={sonicFullIcon.src}
          selected={selectedChain?.id === sonicBlazeTestnet.id}
          className="bg-[#F5F5F5] w-full h-[60px] mt-4"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(sonicBlazeTestnet)}
        /> */}
        <ChainButton
          iconUrl={scrollFullIcon.src}
          selected={selectedChain?.id === scrollSepolia.id}
          className="bg-[#FFF] w-full h-[60px] mt-4"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(scrollSepolia)}
        />
      </div>
      <div>
        <div className="font-medium text-red-300">Mainnet</div>
        {/* <ChainButton
          iconUrl={baseFullIcon.src}
          selected={selectedChain.id === baseSepolia.id}
          className="bg-[#0052FF] w-full h-[60px]"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(baseSepolia)}
        />
        <ChainButton
          iconUrl={avalancheFullIcon.src}
          selected={selectedChain.id === avalancheFuji.id}
          className="bg-[#DF3F3E] w-full h-[60px] mt-4"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(avalancheFuji)}
        /> */}
        <ChainButton
          iconUrl={scrollFullIcon.src}
          selected={selectedChain?.id === scroll.id}
          className="bg-[#F5F5F5] w-full h-[60px] mt-4"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(scroll)}
          disabled
        />
        {/* <ChainButton
          iconUrl={scrollFullIcon.src}
          selected={selectedChain.id === scrollSepolia.id}
          className="bg-[#FFF] w-full h-[60px] mt-4"
          iconClassName="w-[160px] h-[40px]"
          onClick={() => onChainSelect(scrollSepolia)}
        /> */}
      </div>
    </div>
  );
}
