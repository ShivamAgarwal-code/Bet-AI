import { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { chainMetadata } from "./utils";

export const BEAR_RED_HEX = "#E9171A";
export const BULL_GREEN_HEX = "#17E97D";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string
);
export default supabase;
export const BASE_SEPOLIA_APPLICATION_CONTRACT_ADDRESS =
  "0x9b6eA75cA1c0dA7693404CB804E2e56753A36e40";
export const SONIC_BLAZE_APPLICATION_CONTRACT_ADDRESS =
  "0xbf9a9a4220102593296bcdff9c8e5feeeec853f1";
export const SCROLL_SEPOLIA_APPLICATION_CONTRACT_ADDRESS =
  "0x86B9E6BAA8Ae09e7d7c4de2BDCA74C1B20A7CFe4";
export const getChainMetadata = (chainId: number): ChainMetadata => {
  const metadata = chainMetadata[chainId];
  if (!metadata) {
    throw new Error(`No metadata found for chain ID ${chainId}`);
  }
  return metadata;
};
export interface ChainMetadata {
  id: number;
  name: string;
  icon: string;
  iconFull: string;
  family: "EVM" | "Solana";
  nativeSymbol: string;
  primaryColor?: string;
  contractAddress?: `0x${string}`;
}
