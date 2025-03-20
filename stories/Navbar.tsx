"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import localFont from "next/font/local";

export interface NavItem {
  href: string;
  label: string;
  activeClass?: string;
  inactiveClass?: string;
}

export interface NavbarProps {
  className?: string;
  navItems?: NavItem[];
}

const joystix = localFont({
  src: "../public/fonts/joystix.otf",
});

export function Navbar({ className, navItems }: NavbarProps) {
  const pathname = usePathname();

  // Define default active and inactive classes.
  const defaultActiveClass =
    "bg-primary text-primary-foreground hover:text-primary-foreground/80 px-3 py-1 rounded-md";
  const defaultInactiveClass = "text-muted-foreground";

  // Default nav items if not provided, with default active/inactive classes.
  const defaultNavItems: NavItem[] = [
    {
      href: "/rooms",
      label: "Rooms",
      activeClass: defaultActiveClass,
      inactiveClass: defaultInactiveClass,
    },
    {
      href: "/agents",
      label: "Agents",
      activeClass: defaultActiveClass,
      inactiveClass: defaultInactiveClass,
    },
  ];

  // Use provided navItems or fallback to defaults
  const items = navItems || defaultNavItems;

  return (
    <nav className={cn("", className)}>
      <div className="container mx-auto flex h-20 items-center gap-x-8 border-b">
        <Link href="/" className="flex items-center">
          <span className={`${joystix.className} text-2xl`}>AI BETWORKS</span>
        </Link>
        <div className="flex items-center gap-4 ml-8">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base font-thin transition-colors hover:text-white/70",
                pathname === item.href
                  ? item.activeClass || defaultActiveClass
                  : item.inactiveClass || defaultInactiveClass
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto pr-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
