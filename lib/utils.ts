import arbitrumFullIcon from "@/stories/assets/crypto/arbitrum-full-primary.svg";
import arbitrumIcon from "@/stories/assets/crypto/arbitrum.svg";
import baseFullIcon from "@/stories/assets/crypto/base-full-white.svg";
import baseIcon from "@/stories/assets/crypto/base.svg";
import scrollFullIcon from "@/stories/assets/crypto/scroll-full-white.svg";
import scrollIcon from "@/stories/assets/crypto/scroll.svg";
import sonicFullIcon from "@/stories/assets/crypto/sonic-full-white.svg";
import sonicIcon from "@/stories/assets/crypto/sonic.svg";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import EthereumLogo from "../stories/assets/crypto/ethereum.png";
import {
  BASE_SEPOLIA_APPLICATION_CONTRACT_ADDRESS,
  ChainMetadata,
  SCROLL_SEPOLIA_APPLICATION_CONTRACT_ADDRESS,
  SONIC_BLAZE_APPLICATION_CONTRACT_ADDRESS,
} from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

function getTimerColor(secondsLeft: number): string {
  const minutes = secondsLeft / 60;

  if (minutes > 15) return "#FFFFFF"; // White

  if (minutes > 5) {
    // Transition from white to yellow (15m to 5m)
    const progress = (minutes - 5) / 10; // 0 at 5m, 1 at 15m
    const component = Math.floor(255 * progress); // Transition to yellow
    return `rgb(255, 255, ${component})`;
  }

  if (minutes > 2) {
    // Transition from yellow to orange (5m to 2m)
    const progress = (minutes - 2) / 3; // 0 at 2m, 1 at 5m
    const component = Math.floor(255 * progress); // Transition to orange
    return `rgb(255, ${component}, 0)`;
  }

  // Transition from orange to red (2m to 0m)
  const progress = minutes / 2; // 0 at 0m, 1 at 2m
  const component = Math.floor(255 * progress); // Transition to red
  return `rgb(255, ${component}, 0)`;
}

export interface TimerDisplay {
  text: string;
  color: string;
}

export function formatTimeLeft(timestamp: number): TimerDisplay {
  const now = Date.now() / 1000;
  const secondsLeft = Math.max(0, Math.floor(timestamp - now));

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (num: number): string => num.toString().padStart(2, "0");
  return {
    text: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    color: getTimerColor(secondsLeft),
  };
}

export const addressToBackgroundColor = (address: string) => {
  const hash = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `hsl(${hash % 360}, 50%, 50%)`;
};

export const chainMetadata: Record<number, ChainMetadata> = {
  84532: {
    id: 84532,
    name: "Base Sepolia",
    icon: baseIcon.src,
    iconFull: baseFullIcon.src,
    family: "EVM",
    nativeSymbol: "ETH",
    primaryColor: "#0052FF",
    contractAddress: BASE_SEPOLIA_APPLICATION_CONTRACT_ADDRESS,
  },
  421614: {
    id: 421614,
    name: "Arbitrum Sepolia",
    icon: arbitrumIcon.src,
    iconFull: arbitrumFullIcon.src,
    family: "EVM",
    nativeSymbol: "ETH",
    primaryColor: "#2D3748",
  },
  0: {
    id: 0,
    name: "Scroll",
    icon: scrollIcon.src,
    iconFull: scrollFullIcon.src,
    family: "EVM",
    nativeSymbol: "ETH",
  },
  1: {
    id: 1,
    name: "Ethereum",
    icon: EthereumLogo.src,
    iconFull: EthereumLogo.src,
    family: "EVM",
    nativeSymbol: "ETH",
  },
  57054: {
    id: 57054,
    name: "Sonic Blaze Testnet",
    icon: sonicIcon.src,
    iconFull: sonicFullIcon.src,
    family: "EVM",
    nativeSymbol: "S",
    primaryColor: "#F5F5F5",
    contractAddress: SONIC_BLAZE_APPLICATION_CONTRACT_ADDRESS,
  },
  534352: {
    id: 534352,
    name: "Scroll",
    icon: scrollIcon.src,
    iconFull: scrollFullIcon.src,
    family: "EVM",
    nativeSymbol: "ETH",
    contractAddress: SCROLL_SEPOLIA_APPLICATION_CONTRACT_ADDRESS,
  },
  534351: {
    id: 534351,
    name: "Scroll Sepolia",
    icon: scrollIcon.src,
    iconFull: scrollFullIcon.src,
    family: "EVM",
    nativeSymbol: "ETH",
    contractAddress: SCROLL_SEPOLIA_APPLICATION_CONTRACT_ADDRESS,
  },
};

export function generateRandomColor(isLight: boolean) {
  const hue = Math.random() * 360;
  const saturation = 50 + Math.random() * 50; // 50-100%
  const lightness = isLight ? 60 + Math.random() * 30 : 10 + Math.random() * 30; // 60-90% for light, 10-40% for dark

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  return hslToHex(hue, saturation, lightness);
}

/**
 * Converts a block end time (in seconds) to a MM:SS format timer string
 * @param endTime - Unix timestamp in seconds
 * @returns Formatted timer string (e.g. "2:45")
 */
export function blockEndTimeToTimer(endTime: number): string {
  const now = Math.floor(Date.now() / 1000); // Convert JS timestamp to seconds
  const remainingSeconds = endTime - now;

  if (remainingSeconds <= 0) return "0:00";

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
