"use client";

import Loader from "@/components/loader";
import AnimatedBackground from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/lib/config";
import { ROOM_TYPES, ROOM_TYPE_MAPPING, type RoomTypeName } from "@/lib/consts";
import type { Tables } from "@/lib/database.types";
import { CreateRoomModal } from "@/stories/CreateRoomModal";
import { RoomTableRow } from "@/stories/RoomTableRow";
import { animated, useTransition } from "@react-spring/web";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";

/** Types */
export type Agent = Tables<"agents">;
export type Room = Tables<"rooms">;
export type RoomAgent = Tables<"room_agents">;
export type RoundAgentMessage = Tables<"round_agent_messages">;

export interface RoomWithRelations extends Room {
  participants: number;
  agents: {
    id: number;
    displayName: string;
    image: string | null;
    color: string;
  }[];
  roundNumber: number;
  isActive: boolean;
  agentMessages: {
    agentId: number;
    message: string;
    createdAt: string;
    agentDetails: {
      id: number;
      displayName: string;
      image: string | null;
      color: string;
    } | null;
  }[];
}

const ITEMS_PER_PAGE = 10;

const AnimatedCard = animated(Card);

const RoomsPage: FC = () => {
  const [rooms, setRooms] = useState<RoomWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<RoomTypeName | "All">("All");
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInactive, setShowInactive] = useState(false);
  const isBuySell = selectedType === "Buy / Hold / Sell";

  const { isConnected } = useAccount();

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const { data: roomsData, error } = await supabase.from("rooms").select(
          `
            id,
            name,
            type_id,
            image_url,
            color,
            chain_id,
            room_config,
            active,
            rounds!inner(
              id,
              created_at,
              round_agents!inner(
                agent:agent_id(
                  id,
                  display_name,
                  image_url,
                  color
                )
              )
            )
         `
        );

        if (error) {
          console.error("🚨 Supabase Error Loading Rooms:", error);
          setRooms([]); // Ensure rooms don't break UI
          return;
        }

        console.log("✅ Loaded Rooms:", roomsData); // Debug log

        const transformedRooms: RoomWithRelations[] = roomsData.map(
          (room: any) => ({
            ...room,
            participants: room.participants?.[0]?.count ?? 0,
            isActive: room.active ?? true, // Default to true if not specified
            agents:
              room.rounds?.[0]?.round_agents?.map((ra: any) => ({
                id: ra.agent.id,
                displayName: ra.agent.display_name,
                image: ra.agent.image_url || null, // Ensure null if no image
                color: ra.agent.color,
              })) ?? [],
          })
        );

        setRooms(transformedRooms);
      } catch (err) {
        console.error("🚨 Unexpected Error Loading Rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleTypeChange = (value: string | null) => {
    if (!value) return;
    const newType = value as RoomTypeName | "All";
    const currentIndex = ROOM_TYPES.indexOf(selectedType);
    const newIndex = ROOM_TYPES.indexOf(newType);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setSelectedType(newType);
    setCurrentPage(1); // Reset pagination on filter change
  };

  // First filter by active status, then by room type
  const filteredRooms = rooms
    .filter((room) => showInactive || room.active)
    .filter((room) =>
      selectedType === "All"
        ? true
        : ROOM_TYPE_MAPPING[room.type_id] === selectedType
    );

  // **Calculate Pagination**
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const cardTransition = useTransition(
    [{ rooms: paginatedRooms, key: `${selectedType}-${showInactive}` }],
    {
      from: { opacity: 0, transform: `translateX(${direction * 100}%)` },
      enter: { opacity: 1, transform: "translateX(0%)" },
      leave: { opacity: 0, transform: `translateX(${direction * -100}%)` },
      config: { tension: 350, friction: 30, clamp: true },
      keys: (item) => item.key,
    }
  );

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-8 min-h-screen">
      {/* Filters & Create Room Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <div className="bg-secondary/30 p-1.5 rounded-lg">
            <AnimatedBackground
              className="bg-secondary/50 rounded-md"
              defaultValue={selectedType}
              onValueChange={handleTypeChange}
            >
              {ROOM_TYPES.map((type) => (
                <button
                  key={type}
                  data-id={type}
                  className="px-6 py-3 rounded-md text-xl font-medium transition-colors"
                >
                  {type}
                </button>
              ))}
            </AnimatedBackground>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <Label htmlFor="show-inactive" className="text-sm font-medium">
              Show Inactive Rooms
            </Label>
          </div>
        </div>

        <Button
          onClick={() => setCreateRoomOpen(true)}
          disabled={!isConnected}
          className="px-4 py-2 h-fit bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Create Room
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden relative">
        {cardTransition((style, item) => (
          <AnimatedCard
            style={{ ...style, position: "relative", width: "100%" }}
            className="bg-secondary/20 px-4 pt-2 pb-4 rounded-[calc(var(--radius))]"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-b-[6px] border-gray-300 dark:border-gray-400">
                  <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 pl-6 py-4 w-[400px]">
                    Name
                  </TableHead>
                  {/* Hide Type column if it's a Buy/Hold/Sell table */}
                  {!isBuySell && (
                    <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 py-4">
                      Type
                    </TableHead>
                  )}
                  <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 py-4 text-center">
                    Participants
                  </TableHead>
                  <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 text-center py-4 w-[150px]">
                    Network
                  </TableHead>
                  {isBuySell && (
                    <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 py-4">
                      Token
                    </TableHead>
                  )}
                  {/* <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 text-center py-4 w-[150px]">
                    Next Round
                  </TableHead> */}
                  <TableHead className="text-xl font-bold text-gray-700 dark:text-gray-200 pr-6 py-4 w-[200px]">
                    Agents
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.rooms.length > 0 ? (
                  item.rooms.map((room) => (
                    <RoomTableRow
                      key={room.id}
                      room={room}
                      showRoomType={!isBuySell}
                      showToken={isBuySell}
                    />
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={isBuySell ? 5 : 5}
                      className="text-center py-8 text-gray-500"
                    >
                      No rooms found.{" "}
                      {!showInactive && "Try including inactive rooms."}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AnimatedCard>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="text-lg font-bold">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal open={createRoomOpen} onOpenChange={setCreateRoomOpen} />
    </div>
  );
};

export default RoomsPage;
