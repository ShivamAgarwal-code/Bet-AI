import {
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  scroll,
  scrollSepolia,
  sonic,
  sonicBlazeTestnet,
} from "viem/chains";

export const BEAR_RED_HEX = "#E9171A";
export const BULL_GREEN_HEX = "#17E97D";

export type SupportedChains =
  | typeof avalancheFuji
  | typeof avalanche
  | typeof baseSepolia
  | typeof base
  | typeof scrollSepolia
  | typeof scroll
  | typeof sonicBlazeTestnet
  | typeof sonic;

export type RoomTypeName =
  | "Buy / Hold / Sell"
  | "Long / Short"
  | "Just Chat"
  | "All";

export const ROOM_TYPES: RoomTypeName[] = [
  "All",
  "Buy / Hold / Sell",
  "Long / Short",
  "Just Chat",
];

export const ROOM_TYPE_MAPPING: { [key: number]: RoomTypeName } = {
  1: "Buy / Hold / Sell",
  2: "Long / Short",
  3: "Just Chat",
};
