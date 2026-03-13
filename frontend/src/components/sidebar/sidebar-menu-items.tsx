"use client";

import { Home, Wand2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const items = [
  { title: "Discover", url: "/home", icon: Home },
  { title: "Create", url: "/create", icon: Wand2 },
];

export default function SidebarMenuItems() {
  const path = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = path === item.url;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <a href={item.url} className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
