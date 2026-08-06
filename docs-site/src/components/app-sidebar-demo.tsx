"use client";

import * as React from "react";
import {
  AppSidebar,
  type AppSidebarItem,
} from "@erp/miniapp-ui";
import {
  LayoutDashboardIcon,
  PackageIcon,
  UsersIcon,
  StoreIcon,
  WalletIcon,
  MegaphoneIcon,
} from "lucide-react";

const DEMO_ITEMS: AppSidebarItem[] = [
  { id: "main", label: "Main", type: "section" },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    children: [
      { id: "hrm", label: "HRM Dashboard" },
      { id: "inventory-dash", label: "Inventory Dashboard" },
      { id: "crm", label: "CRM Dashboard" },
    ],
  },
  { id: "inventory", label: "Inventory", type: "section" },
  { id: "products", label: "Products", icon: <PackageIcon /> },
  {
    id: "customers",
    label: "Customers",
    icon: <UsersIcon />,
    children: [
      { id: "customers-all", label: "All customers" },
      { id: "customers-segments", label: "Segments" },
    ],
  },
  { id: "shop", label: "Shop", icon: <StoreIcon /> },
  { id: "income", label: "Income", icon: <WalletIcon /> },
  { id: "promote", label: "Promote", icon: <MegaphoneIcon /> },
];

export function AppSidebarDemo() {
  const [activeId, setActiveId] = React.useState("hrm");

  return (
    <div className="flex h-[32rem] w-full max-w-4xl gap-3 overflow-hidden rounded-md bg-surface p-3">
      <AppSidebar
        items={DEMO_ITEMS}
        activeId={activeId}
        onItemSelect={(item) => setActiveId(item.id)}
        logo={
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              DE
            </span>
            <span className="text-sm font-semibold">Dreams ERP</span>
          </div>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
        <header className="flex h-14 shrink-0 items-center border-b border-border px-4 text-sm text-muted-foreground">
          Topbar
        </header>
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          Active: <span className="ms-1 font-medium text-foreground">{activeId}</span>
        </div>
      </div>
    </div>
  );
}
