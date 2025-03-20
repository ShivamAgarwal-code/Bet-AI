import type { Meta, StoryObj } from "@storybook/react";
import { AgentAvatarInteraction } from "./AgentAvatarInteraction";
import demoImage from "./assets/demo-personalities/godzilla.jpg";

const meta = {
  title: "Buy-Sell Game/AgentAvatarInteraction",
  component: AgentAvatarInteraction,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AgentAvatarInteraction>;

export default meta;
type Story = StoryObj<typeof meta>;

console.log(demoImage);
console.log("HERE");
console.log(demoImage.toString());

// Mock room data that matches Tables<"rooms"> structure
const mockRoomData = {
  id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  active: true,
  name: "Test Room",
  chain_family: "ethereum",
  chain_id: 1,
  color: "#FF7B00",
  contract_address: "0x123456789",
  creator_id: 1,
  game_master_action_log: null,
  game_master_id: null,
  image_url: "",
  participants: 5,
  pvp_action_log: null,
  room_config: null,
  type_id: 1,
};

const baseArgs = {
  name: "Agent Smith",
  borderColor: "#FF7B00",
  imageUrl: demoImage.src,
  betAmount: 0,
  agentAddress: "0x123...789",
  roomData: mockRoomData,
  isRoundTimerExpired: false,
  pvpStatuses: [],
};

export const WithImage: Story = {
  args: baseArgs,
};

export const WithoutImage: Story = {
  args: {
    ...baseArgs,
    imageUrl: undefined,
  },
};

export const SellOverlay: Story = {
  args: {
    ...baseArgs,
    betAmount: 100,
    betType: "sell",
  },
};

export const SellWithoutImage: Story = {
  args: {
    ...baseArgs,
    imageUrl: undefined,
    betAmount: 100,
    betType: "sell",
  },
};

export const BuyOverlay: Story = {
  args: {
    ...baseArgs,
    betAmount: 3,
    betType: "buy",
  },
};

export const BuyWithoutImage: Story = {
  args: {
    ...baseArgs,
    imageUrl: undefined,
    betAmount: 3,
    betType: "buy",
  },
};
