import { Json } from "@/lib/database.types";
import type { Meta, StoryObj } from "@storybook/react";
import { BuySellGameAvatarInteraction } from "./BuySellGameAvatarInteraction";
import demoImage from "./assets/demo-personalities/godzilla.jpg";

const meta: Meta<typeof BuySellGameAvatarInteraction> = {
  title: "Buy-Sell Game/BuySellGameAvatarInteraction",
  component: BuySellGameAvatarInteraction,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[510px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BuySellGameAvatarInteraction>;

// Mock room data for Storybook
const mockRoomData = {
  id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  name: "Demo Room",
  active: true,
  chain_family: "ethereum",
  chain_id: 1,
  color: "#FF7B00",
  contract_address: "0x1234567890abcdef1234567890abcdef12345678",
  creator_id: 1,
  game_master_action_log: null as Json,
  game_master_id: null,
  image_url: null,
  participants: 0,
  pvp_action_log: null as Json,
  room_config: null as Json,
  type_id: 1,
};

const baseArgs = {
  id: 1, // Changed from string to number to match the interface
  name: "Agent Smith",
  borderColor: "#FF7B00",
  imageUrl: demoImage.src,
  betAmount: 0,
  address: "0x1234567890abcdef1234567890abcdef12345678", // Added required prop
  roomData: mockRoomData, // Added required prop
  pvpStatuses: [], // Added required prop
  isRoundTimerExpired: false, // Added required prop
  hold: 0, // Added missing prop
};

export const FullVariantRandomValues: Story = {
  args: {
    ...baseArgs,
    sell: 60, // Changed from bearAmount to sell
    buy: 40, // Changed from bullAmount to buy
    variant: "full",
  },
};

export const FullVariantWithoutName: Story = {
  args: {
    ...baseArgs,
    sell: 60, // Changed from bearAmount to sell
    buy: 40, // Changed from bullAmount to buy
    variant: "full",
    showName: false,
  },
};

export const SlimVariantRandomValues: Story = {
  args: {
    ...baseArgs,
    sell: 60, // Changed from bearAmount to sell
    buy: 40, // Changed from bullAmount to buy
    variant: "slim",
  },
};

export const SlimVariantWithoutName: Story = {
  args: {
    ...baseArgs,
    sell: 60, // Changed from bearAmount to sell
    buy: 40, // Changed from bullAmount to buy
    variant: "slim",
    showName: false,
  },
};

export const FullVariantNoBear: Story = {
  args: {
    ...baseArgs,
    sell: 0, // Changed from bearAmount to sell
    buy: 100, // Changed from bullAmount to buy
    variant: "full",
  },
};

export const SlimVariantNoBear: Story = {
  args: {
    ...baseArgs,
    sell: 0, // Changed from bearAmount to sell
    buy: 100, // Changed from bullAmount to buy
    variant: "slim",
  },
};

export const FullVariantNoBull: Story = {
  args: {
    ...baseArgs,
    sell: 100, // Changed from bearAmount to sell
    buy: 0, // Changed from bullAmount to buy
    variant: "full",
  },
};

export const SlimVariantNoBull: Story = {
  args: {
    ...baseArgs,
    sell: 100, // Changed from bearAmount to sell
    buy: 0, // Changed from bullAmount to buy
    variant: "slim",
  },
};

export const FullVariantNoAmounts: Story = {
  args: {
    ...baseArgs,
    sell: 0, // Changed from bearAmount to sell
    buy: 0, // Changed from bullAmount to buy
    variant: "full",
  },
};

export const SlimVariantNoAmounts: Story = {
  args: {
    ...baseArgs,
    sell: 0, // Changed from bearAmount to sell
    buy: 0, // Changed from bullAmount to buy
    variant: "slim",
  },
};

export const WithActiveBet: Story = {
  args: {
    ...baseArgs,
    sell: 60, // Changed from bearAmount to sell
    buy: 40, // Changed from bullAmount to buy
    betAmount: 100,
    betType: "Sell",
    variant: "full",
  },
};

export const WithActiveBetWithoutName: Story = {
  args: {
    ...baseArgs,
    sell: 60, // Changed from bearAmount to sell
    buy: 40, // Changed from bullAmount to buy
    betAmount: 100,
    betType: "Sell",
    variant: "full",
    showName: false,
  },
};
