import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomeIcon, SettingsIcon, UsersIcon } from "lucide-react";

import { AppSidebar, type AppSidebarItem } from "./app-sidebar";

const meta: Meta<typeof AppSidebar> = {
  title: "Patterns/AppSidebar",
  component: AppSidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

const items: AppSidebarItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon />, href: "#" },
  {
    id: "team",
    label: "Team",
    icon: <UsersIcon />,
    children: [
      { id: "members", label: "Members", href: "#" },
      { id: "roles", label: "Roles", href: "#" },
    ],
  },
  { id: "settings", label: "Settings", icon: <SettingsIcon />, href: "#" },
];

export const Default: Story = {
  render: () => (
    <div className="h-96">
      <AppSidebar items={items} activeId="home" />
    </div>
  ),
};

export const WithActiveChild: Story = {
  render: () => (
    <div className="h-96">
      <AppSidebar items={items} activeId="members" />
    </div>
  ),
};

/** Icon-only rail — click the header toggle to expand. */
export const Collapsed: Story = {
  render: () => (
    <div className="h-96">
      <AppSidebar items={items} activeId="home" defaultCollapsed />
    </div>
  ),
};

/** `collapsible={false}` hides the toggle for apps that own their own chrome. */
export const NotCollapsible: Story = {
  render: () => (
    <div className="h-96">
      <AppSidebar items={items} activeId="home" collapsible={false} />
    </div>
  ),
};
