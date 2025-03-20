import { Tables } from "@/lib/database.types";
import { PartialExcept } from "@/lib/utils";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import AgentsTable from "./AgentsLandingTable";

// Mock data for the agents
const mockAgents: PartialExcept<
  Tables<"agents">,
  | "id"
  | "display_name"
  | "type"
  | "earnings"
  | "eth_wallet_address"
  | "image_url"
  | "color"
>[] = [
  {
    id: 1,
    display_name: "CryptoWhale",
    type: "AI",
    earnings: 1250,
    eth_wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
    image_url: "/default-agent.png",
    color: "#3B82F6",
  },
  {
    id: 2,
    display_name: "TokenTrader",
    type: "AI",
    earnings: 980,
    eth_wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    image_url: "/default-agent.png",
    color: "#10B981",
  },
  {
    id: 3,
    display_name: "BlockchainGuru",
    type: "AI",
    earnings: 750,
    eth_wallet_address: "0x7890abcdef1234567890abcdef1234567890abcd",
    image_url: "/default-agent.png",
    color: "#F59E0B",
  },
  {
    id: 4,
    display_name: "DeFiMaster",
    type: "AI",
    earnings: 520,
    eth_wallet_address: "0xdef1234567890abcdef1234567890abcdef123456",
    image_url: "/default-agent.png",
    color: "#EC4899",
  },
  {
    id: 5,
    display_name: "NFTCollector",
    type: "AI",
    earnings: 320,
    eth_wallet_address: "0x567890abcdef1234567890abcdef1234567890ab",
    image_url: "/default-agent.png",
    color: "#8B5CF6",
  },
];

// For Storybook, we'll use MSW or just mock the component instead of using jest.mock

const meta = {
  title: "Components/AgentsTable",
  component: AgentsTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AgentsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock implementation of the AgentsTable component for Storybook
// This approach avoids using jest.mock which isn't appropriate for Storybook
const MockedAgentsTable = () => {
  const [agents, setAgents] = useState<typeof mockAgents>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 1000);
  }, []);

  // Create an array of 5 skeleton rows that show static row numbers.
  const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full"></div>
        <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
      </td>
      <td className="text-sm text-center">
        <div className="h-4 w-20 bg-gray-300 animate-pulse rounded"></div>
      </td>
      <td className="text-center">
        <div className="flex items-center justify-center gap-1">
          <div className="h-4 w-4 bg-gray-300 animate-pulse rounded"></div>
          <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
        </div>
      </td>
    </tr>
  ));

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left">#</th>
          <th className="text-left">Agent</th>
          <th className="text-center">Address</th>
          <th className="text-center">Earnings</th>
        </tr>
      </thead>
      <tbody>
        {loading
          ? skeletonRows
          : agents.map((agent, index) => (
              <tr key={agent.id}>
                <td>{index + 1}</td>
                <td>{agent.display_name}</td>
                <td className="text-center">
                  {agent.eth_wallet_address
                    ? `${agent.eth_wallet_address.slice(
                        0,
                        6
                      )}...${agent.eth_wallet_address.slice(-4)}`
                    : "N/A"}
                </td>
                <td className="text-center">
                  {agent.earnings !== null
                    ? `${agent.earnings.toFixed(0)} USDC`
                    : "N/A"}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export const Default: Story = {
  render: () => <MockedAgentsTable />,
};

// Loading state
const LoadingState = () => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left">#</th>
          <th className="text-left">Agent</th>
          <th className="text-center">Address</th>
          <th className="text-center">Earnings</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
            </td>
            <td className="text-sm text-center">
              <div className="h-4 w-20 bg-gray-300 animate-pulse rounded"></div>
            </td>
            <td className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="h-4 w-4 bg-gray-300 animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const Loading: Story = {
  render: () => <LoadingState />,
};

// Empty state
const EmptyState = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with empty result
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left">#</th>
          <th className="text-left">Agent</th>
          <th className="text-center">Address</th>
          <th className="text-center">Earnings</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full"></div>
                <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
              </td>
              <td className="text-sm text-center">
                <div className="h-4 w-20 bg-gray-300 animate-pulse rounded"></div>
              </td>
              <td className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="h-4 w-4 bg-gray-300 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-4">
              No agents found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const Empty: Story = {
  render: () => <EmptyState />,
};
