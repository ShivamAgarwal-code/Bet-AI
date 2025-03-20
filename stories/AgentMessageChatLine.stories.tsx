import { WsMessageTypes } from "@/lib/backend.types";
import { Tables } from "@/lib/database.types";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AgentMessageChatLine } from "./AgentMessageChatLine";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

// Mock agent data
const mockAgents: Tables<"agents">[] = [
  {
    id: 58,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    display_name: "Agent Smith",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=1",
    color: "#FF0000",
    creator_id: 1,
    type: "default",
    status: "active",
    character_card: null,
    earnings: null,
    endpoint: "default",
    eth_wallet_address: null,
    platform: "discord",
    single_sentence_summary: null,
    sol_wallet_address: null,
    last_health_check: null,
    uuid: null,
  },
  {
    id: 56,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    display_name: "Agent Johnson",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=2",
    color: "#00FF00",
    creator_id: 1,
    type: "default",
    status: "active",
    character_card: null,
    earnings: null,
    endpoint: "default",
    eth_wallet_address: null,
    platform: "discord",
    single_sentence_summary: null,
    sol_wallet_address: null,
    last_health_check: null,
    uuid: null,
  },
  {
    id: 57,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    display_name: "Agent Brown",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=3",
    color: "#0000FF",
    creator_id: 1,
    type: "default",
    status: "active",
    character_card: null,
    earnings: null,
    endpoint: "default",
    eth_wallet_address: null,
    platform: "discord",
    single_sentence_summary: null,
    sol_wallet_address: null,
    last_health_check: null,
    uuid: null,
  },
];

// Update query data to match the IDs used in stories
queryClient.setQueryData(["agents", [56, 57, 58]], mockAgents);

const meta: Meta<typeof AgentMessageChatLine> = {
  title: "Components/AgentMessageChatLine",
  component: AgentMessageChatLine,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-[800px] p-4 bg-gray-900">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AgentMessageChatLine>;

// Mock data that matches the schema
export const Default: Story = {
  args: {
    message: {
      messageType: WsMessageTypes.AGENT_MESSAGE,
      content: {
        timestamp: Date.now(),
        roomId: 1,
        roundId: 1,
        senderId: 58, // This is the primary agent now
        originalMessage: {
          messageType: WsMessageTypes.AGENT_MESSAGE,
          signature: "0x...",
          sender: "0x0",
          content: {
            timestamp: Date.now(),
            roomId: 1,
            roundId: 1,
            agentId: 56,
            text: "Hello! This is a test message from an AI agent.",
          },
        },
        originalTargets: [56, 57],
        currentBlockTimestamp: Date.now(),
        postPvpMessages: {
          "56": {
            messageType: WsMessageTypes.AGENT_MESSAGE,
            signature: "0x...",
            sender: "0x0",
            content: {
              timestamp: Date.now(),
              roomId: 1,
              roundId: 1,
              agentId: 56,
              text: "Hello! This is a test message from an AI agent.",
            },
          },
          "57": {
            messageType: WsMessageTypes.AGENT_MESSAGE,
            signature: "0x...",
            sender: "0x0",
            content: {
              timestamp: Date.now(),
              roomId: 1,
              roundId: 1,
              agentId: 57,
              text: "And I'm joining in too!",
            },
          },
        },
        pvpStatusEffects: {},
      },
    },
    showSentiment: true,
  },
};

export const EmptyMessage: Story = {
  args: {
    message: {
      messageType: WsMessageTypes.AGENT_MESSAGE,
      content: {
        timestamp: Date.now(),
        roomId: 1,
        roundId: 1,
        senderId: 58,
        originalMessage: {
          messageType: WsMessageTypes.AGENT_MESSAGE,
          signature: "0x...",
          sender: "0x0",
          content: {
            timestamp: Date.now(),
            roomId: 1,
            roundId: 1,
            agentId: 58,
            text: "", // Empty message will trigger the funny empty message
          },
        },
        originalTargets: [],
        currentBlockTimestamp: Date.now(),
        postPvpMessages: {},
        pvpStatusEffects: {},
      },
    },
    showSentiment: true,
  },
};

// Add a story with multiple agents to test the bulk fetching
export const MultipleAgents: Story = {
  args: {
    message: {
      messageType: WsMessageTypes.AGENT_MESSAGE,
      content: {
        timestamp: Date.now(),
        roomId: 1,
        roundId: 1,
        senderId: 58,
        originalMessage: {
          messageType: WsMessageTypes.AGENT_MESSAGE,
          signature: "0x...",
          sender: "0x0",
          content: {
            timestamp: Date.now(),
            roomId: 1,
            roundId: 1,
            agentId: 58,
            text: "We're all here together!",
          },
        },
        originalTargets: [56, 57],
        currentBlockTimestamp: Date.now(),
        postPvpMessages: {
          "56": {
            messageType: WsMessageTypes.AGENT_MESSAGE,
            signature: "0x...",
            sender: "0x0",
            content: {
              timestamp: Date.now(),
              roomId: 1,
              roundId: 1,
              agentId: 56,
              text: "We're all here together!",
            },
          },
          "57": {
            messageType: WsMessageTypes.AGENT_MESSAGE,
            signature: "0x...",
            sender: "0x0",
            content: {
              timestamp: Date.now(),
              roomId: 1,
              roundId: 1,
              agentId: 57,
              text: "Indeed we are!",
            },
          },
        },
        pvpStatusEffects: {},
      },
    },
    showSentiment: true,
  },
};
