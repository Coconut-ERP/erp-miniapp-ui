# Sidebar

## Purpose

Collapsible application sidebar with desktop rail and mobile sheet.

## Import

```ts
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, useSidebar } from "@erp/miniapp-ui";
```

## Props

Follows the underlying Radix / native element props unless noted. Prefer composition over prop sprawl.

## Variants

| `collapsible` | Behavior |
| --- | --- |
| `offcanvas` (default) | Sidebar slides fully off-screen when collapsed |
| `icon` | Collapses to icon rail |
| `none` | Always expanded — `SidebarTrigger` does not resize it |

| `variant` | Look |
| --- | --- |
| `sidebar` (default) | Flush edge with border |
| `floating` | Rounded floating panel |
| `inset` | Inset main canvas |

## Example

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@erp/miniapp-ui";

<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>App</SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Home">Home</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b px-4">
      <SidebarTrigger />
    </header>
  </SidebarInset>
</SidebarProvider>
```

Toggle with `SidebarTrigger`, or keyboard **Ctrl/⌘+B**.
## API

Public exports: `SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarGroupAction, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarInset, SidebarInput, SidebarSeparator, SidebarRail, SidebarTrigger, useSidebar`.

## Source

`src/components/ui/sidebar.tsx`
