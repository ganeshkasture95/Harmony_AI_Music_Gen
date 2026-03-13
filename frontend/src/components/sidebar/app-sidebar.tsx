"use server";

import { UserButton } from "@daveyplate/better-auth-ui";
import { Sparkles, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "../ui/sidebar";
import { Credits } from "./credits";
import SidebarMenuItems from "./sidebar-menu-items";
import Upgrade from "./upgrade";

export async function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/60">
      {/* Logo */}
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">HarmonyAI</span>
            <span className="text-[10px] text-muted-foreground">AI Music Studio</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 px-3 py-3">
        {/* Credits pill */}
        <div className="mb-3 flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2">
          <div className="text-xs text-muted-foreground">Credits remaining</div>
          <div className="flex items-center gap-1.5">
            <Credits />
          </div>
        </div>

        {/* Upgrade button */}
        <Upgrade />

        {/* User button */}
        <div className="mt-2">
          <UserButton
            variant="outline"
            additionalLinks={[
              {
                label: "Customer Portal",
                href: "/customer-portal",
                icon: <User className="h-4 w-4" />,
              },
            ]}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
