"use client";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { chainMetadata } from "@/lib/utils";
import { RoomWithRelations } from "@/stories/RoomTable";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties } from "react";
import { AgentAvatar } from "./AgentAvatar";
import { roomTypeMapping } from "./RoomTable";

interface RoomTableRowProps {
  room: RoomWithRelations;
  showRoomType: boolean;
  showToken: boolean;
  style?: CSSProperties;
  className?: string;
}

export function RoomTableRow({
  room,
  showRoomType,
  style,
  showToken,
  className = "hover:bg-secondary/20",
}: RoomTableRowProps) {
  // const timer = formatTimeLeft(
  //   new Date(room.round_ends_on || "000000").getTime() / 1000
  // ); // Ensure the format is correct
  const roomType = roomTypeMapping[room.type_id];
  // Use the active field from the database, falling back to isActive if available
  const isActive = room.active !== false && room.isActive !== false; // Default to true if undefined or true

  return (
    <TableRow
      style={style}
      className={`${className} ${!isActive ? "opacity-60" : ""}`}
    >
      <TableCell className="text-xl pl-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/rooms/${room.id}`}
            className="hover:underline font-medium capitalize"
            style={{ color: room.color || "black" }}
          >
            {room.name}
          </Link>
          {!isActive && (
            <Badge
              variant="outline"
              className="text-xs bg-gray-100 dark:bg-gray-800"
            >
              Inactive
            </Badge>
          )}
        </div>
      </TableCell>

      {showRoomType && (
        <TableCell className="text-lg text-gray-900 dark:text-gray-300">
          {roomType}
        </TableCell>
      )}

      <TableCell className="text-lg text-gray-900 dark:text-gray-300 text-center">
        {room.participants}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex justify-center">
          {room.chain_id && chainMetadata[room.chain_id]?.icon && (
            <Image
              src={chainMetadata[room.chain_id]?.icon}
              alt={chainMetadata[room.chain_id]?.name}
              className="size-6"
              width={2000}
              height={2000}
            />
          )}
        </div>
      </TableCell>

      {showToken ? (
        <TableCell>
          <div className="flex items-center gap-2">
            <img
              src={
                (room.room_config as any)?.token?.image_url ||
                "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040"
              }
              alt={(room.room_config as any)?.token?.symbol || "unknown token"}
              className="size-6"
              width={20}
              height={20}
            />
            <span className="text-lg text-gray-900 dark:text-gray-300">
              {(room.room_config as any)?.room_config?.buySellTokenSymbol}
            </span>
          </div>
        </TableCell>
      ) : null}

      {/* <TableCell className="text-lg text-center">
        <span style={{ color: timer.color }}>{timer.text}</span>
      </TableCell> */}

      <TableCell className="pr-6">
        <div className="flex -space-x-2">
          {room.agents?.map((agent) => (
            <AgentAvatar
              key={agent.id}
              id={agent.id}
              name={agent.displayName}
              imageUrl={agent.image || ""}
              borderColor={agent.color}
              variant="sm"
            />
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}
