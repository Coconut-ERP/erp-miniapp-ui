# App Sidebar

Dreams ERP–aligned application navigation. Pass a nav list (`items` + `activeId`) — the library owns spacing, section titles, and active styles so mini apps stay in sync.

## When

Use for mini-app chrome instead of composing low-level `Sidebar*` or inventing per-page nav styles.

## Composition

```tsx
import { AppSidebar, type AppSidebarItem } from "@erp/miniapp-ui";
import { LayoutDashboardIcon, PackageIcon } from "lucide-react";

const items: AppSidebarItem[] = [
  { id: "main", label: "Main", type: "section" },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    children: [
      { id: "hrm", label: "HRM Dashboard", href: "/" },
      { id: "inventory", label: "Inventory Dashboard", href: "/inventory" },
    ],
  },
  { id: "inventory-sec", label: "Inventory", type: "section" },
  { id: "products", label: "Products", icon: <PackageIcon />, href: "/products" },
];

<AppSidebar
  items={items}
  activeId="hrm"
  logo={<span className="text-sm font-semibold">Dreams ERP</span>}
  renderLink={({ item, className, children, isActive, onClick }) => (
    <a href={item.href} className={className} aria-current={isActive ? "page" : undefined} onClick={onClick}>
      {children}
    </a>
  )}
/>
```

Shell frame (kit, after library is ready): outer `p-3` (`--shell-inset`), sidebar width `--sidenav-width`, content panel `rounded-md border`, main `p-6 gap-4` — do **not** override these in page components.

## Do

- Use `type: "section"` for Dreams `menu-title` groups
- Set `activeId` from the router; keep copy in app `constants/`
- Prefer lucide icons

## Don't

- Re-style rows with one-off `className` on pages (breaks sync)
- Fork low-level `Sidebar*` for this chrome look
- Hard-code hex colors — use semantic tokens

## Related

- Low-level compound: [Sidebar](../components/sidebar.md)
- Tokens: `src/styles/globals.css` (Dreams dark default; `.light` optional)
