"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@erp/miniapp-ui";
import { HomeIcon, SettingsIcon, UsersIcon, LayoutDashboardIcon, FileTextIcon } from "lucide-react";

function SidebarStatus() {
  const { state, open } = useSidebar();
  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      {state}
      <span className="mx-1 text-border">·</span>
      open={String(open)}
    </span>
  );
}

export function SidebarIconDemo() {
  return (
    <SidebarProvider defaultOpen className="h-[320px] min-h-0! w-full overflow-hidden">
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b px-2 py-2 text-sm font-medium">Mini App</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home">
                    <HomeIcon />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Employees">
                    <UsersIcon />
                    <span>Employees</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-auto bg-background">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <SidebarStatus />
        </header>
        <div className="p-4 text-sm text-muted-foreground">
          Click the trigger to collapse to an icon rail, then expand again.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function SidebarOffcanvasDemo() {
  return (
    <SidebarProvider defaultOpen className="h-[280px] min-h-0! w-full overflow-hidden">
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="border-b px-2 py-2 text-sm font-medium">App</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileTextIcon />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 bg-background">
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <SidebarStatus />
        </header>
        <div className="p-4 text-sm text-muted-foreground">
          Offcanvas hides the sidebar completely when collapsed.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
