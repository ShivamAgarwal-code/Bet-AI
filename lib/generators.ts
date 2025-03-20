/**
 * @deprecated This file is deprecated and will be removed in a future release.
 * Please use the appropriate data fetching methods or mock data utilities instead.
 */
import { faker } from "@faker-js/faker";
import { Database } from "./database.types";

// Type aliases from database schema
type Agent = Database["public"]["Tables"]["agents"]["Row"];
type Room = Database["public"]["Tables"]["rooms"]["Row"];
type RoomType = Database["public"]["Tables"]["room_types"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

// Define the AgentChatMessage type that was previously imported
export interface AgentChatMessage {
  agentName: string;
  agentImageUrl: string;
  agentBorderColor: string;
  message: string;
  sentiment?: "Positive" | "Negative" | "Neutral";
  additionalIcons?: string[];
}

// Generator for Agent
export const generateAgent = (overrides: Partial<Agent> = {}): Agent => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  created_at: faker.date.recent().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  creator_id: faker.number.int({ min: 1, max: 10000 }),
  display_name: faker.internet.userName(),
  image_url: faker.image.avatar(),
  platform: faker.helpers.arrayElement(["Autonome", "Gaia"]),
  endpoint: faker.internet.url(),
  eth_wallet_address: faker.finance.ethereumAddress(),
  sol_wallet_address: faker.finance.ethereumAddress(),
  status: faker.helpers.arrayElement(["Up", "Down", "Unknown"]),
  last_health_check: faker.date.recent().toISOString(),
  character_card: faker.lorem.paragraph(),
  single_sentence_summary: faker.lorem.sentence(),
  color: faker.color.rgb(),
  earnings: null,
  type: "AI",
  uuid: null,
  ...overrides,
});

// Generator for User
export const generateUser = (overrides: Partial<User> = {}): User => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  created_at: faker.date.recent().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  address: faker.finance.ethereumAddress(),
  chain_id: faker.helpers.arrayElement(["1", "137", "42161"]), // Fixed: Using string instead of number
  display_name: faker.internet.userName(),
  ...overrides,
});

// Generator for Room
export const generateRoom = (overrides: Partial<Room> = {}): Room => {
  // Create a base room without the problematic property
  const baseRoom: Partial<Room> = {
    id: faker.number.int({ min: 1, max: 10000 }),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    name: faker.company.name(),
    creator_id: faker.number.int({ min: 1, max: 10000 }),
    type_id: faker.number.int({ min: 1, max: 10 }),
    chain_family: faker.helpers.arrayElement(["evm", "solana"]),
    chain_id: faker.number.int({ min: 1, max: 42161 }),
    contract_address: faker.finance.ethereumAddress(),
    image_url: faker.image.url(),
    color: faker.color.rgb(),
    active: true,
    game_master_id:
      faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10000 })) ??
      null,
    room_config: {
      room_config: {},
      pvp: {
        enabled: true,
        allowed_functions: ["DEAFEN", "POISON"],
      },
    },
    game_master_action_log: null,
    pvp_action_log: null,
    participants: faker.number.int({ min: 1, max: 20 }),
  };

  // Merge with overrides and return as Room
  return { ...baseRoom, ...overrides } as Room;
};

// Generator for RoomType
export const generateRoomType = (
  overrides: Partial<RoomType> = {}
): RoomType => ({
  id: faker.number.int({ min: 1, max: 100 }),
  created_at: faker.date.recent().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  name: faker.helpers.arrayElement([
    "Buy Sell",
    "Prediction Market",
    "Just Chat",
  ]),
  description: faker.lorem.sentence(),
  ai_chat_fee: faker.number.float({ min: 0.1, max: 10 }),
  ...overrides,
});

// Helper to generate multiple items
export const generateMany = <T>(
  generator: (overrides?: Partial<T>) => T,
  count: number,
  overrides: Partial<T> = {}
): T[] => {
  return Array.from({ length: count }, () => generator(overrides));
};

// Generator for AgentChatMessage (UI-specific type)
export const generateAgentChatMessage = (
  overrides: Partial<AgentChatMessage> = {}
): AgentChatMessage => ({
  agentName: faker.internet.userName(),
  agentImageUrl: faker.helpers.maybe(() => faker.image.avatar()) || "",
  agentBorderColor: faker.color.rgb(),
  message: faker.lorem.paragraph(),
  sentiment: faker.helpers.maybe(() =>
    faker.helpers.arrayElement(["Positive", "Negative", "Neutral"])
  ),
  additionalIcons: faker.helpers.maybe(() =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
      faker.image.url()
    )
  ),
  ...overrides,
});

// Helper to generate a conversation of messages
export const generateAgentConversation = (
  numMessages: number = 5,
  overrides: Partial<AgentChatMessage> = {}
): AgentChatMessage[] => {
  return Array.from({ length: numMessages }, () =>
    generateAgentChatMessage(overrides)
  );
};
