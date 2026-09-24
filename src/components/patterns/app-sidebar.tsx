"use client";

import * as React from "react";
import { ChevronDownIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export type AppSidebarItem = {
  /** Stable id used with `activeId`. */
  id: string;
  label: string;
  /** Section header (Dreams `menu-title`) — not navigable. */
  type?: "item" | "section";
  /** Typically a lucide icon element, e.g. `<HomeIcon />`. */
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  children?: AppSidebarItem[];
};

export type AppSidebarProps = {
  items: AppSidebarItem[];
  /** Id of the active leaf or parent item. */
  activeId?: string;
  /** Called when a navigable item is activated (click / Enter). */
  onItemSelect?: (item: AppSidebarItem) => void;
  /**
   * Optional custom link renderer (e.g. Next.js `Link`).
   * Defaults to `<a href>` when `item.href` is set, otherwise a `<button>`.
   */
  renderLink?: (props: {
    item: AppSidebarItem;
    className: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick: (event: React.MouseEvent) => void;
  }) => React.ReactNode;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Accessible name for the nav landmark. */
  navLabel?: string;
  /** Show the desktop collapse toggle (icon-only rail). Defaults to `true`. */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

function itemOrChildIsActive(item: AppSidebarItem, activeId?: string): boolean {
  if (!activeId) return false;
  if (item.id === activeId) return true;
  return item.children?.some((child) => itemOrChildIsActive(child, activeId)) ?? false;
}

function DefaultLogo() {
  return (
    <div className="flex items-center gap-2">
      <div
        aria-hidden
        className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
        </svg>
      </div>
      <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Mini App</span>
    </div>
  );
}

function NavLink({
  item,
  isActive,
  className,
  children,
  onItemSelect,
  renderLink,
}: {
  item: AppSidebarItem;
  isActive: boolean;
  className: string;
  children: React.ReactNode;
  onItemSelect?: (item: AppSidebarItem) => void;
  renderLink?: AppSidebarProps["renderLink"];
}) {
  const onClick = (event: React.MouseEvent) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    onItemSelect?.(item);
  };

  if (renderLink) {
    return <>{renderLink({ item, className, children, isActive, onClick })}</>;
  }

  if (item.href) {
    return (
      <a
        href={item.disabled ? undefined : item.href}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={item.disabled || undefined}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      aria-current={isActive ? "page" : undefined}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** Dreams parent row: padding-block 6px / inline 10px, text 14px; active = dark fill + white */
function parentClassName(isActive: boolean, disabled?: boolean, collapsed?: boolean) {
  return cn(
    "relative flex w-full items-center rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring/50",
    collapsed && "justify-center px-0",
    disabled && "pointer-events-none opacity-50",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-muted",
  );
}

/** Dreams submenu: text 13px, pl ~44px; active = primary + dot */
function childClassName(isActive: boolean, disabled?: boolean) {
  return cn(
    "relative flex w-full items-center rounded-md py-1 pe-4 ps-11 text-[13px] font-medium transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring/50",
    disabled && "pointer-events-none opacity-50",
    isActive
      ? "text-primary before:absolute before:start-6 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
      : "text-muted-foreground hover:text-sidebar-foreground",
  );
}

function NavItemRow({
  item,
  activeId,
  onItemSelect,
  renderLink,
  collapsed,
  onExpand,
}: {
  item: AppSidebarItem;
  activeId?: string;
  onItemSelect?: (item: AppSidebarItem) => void;
  renderLink?: AppSidebarProps["renderLink"];
  collapsed?: boolean;
  onExpand?: () => void;
}) {
  if (item.type === "section") {
    return (
      <div
        data-slot="app-sidebar-section"
        className={cn(
          "mt-4 mb-2 first:mt-0 text-[13px] font-semibold text-sidebar-foreground/80",
          collapsed ? "mx-2.5 border-t border-sidebar-border" : "px-2.5",
        )}
      >
        <span className={cn(collapsed && "sr-only")}>{item.label}</span>
      </div>
    );
  }

  const hasChildren = Boolean(item.children?.length);
  const isActive = item.id === activeId;
  const branchActive = itemOrChildIsActive(item, activeId);
  const [open, setOpen] = React.useState(branchActive);

  React.useEffect(() => {
    if (branchActive) setOpen(true);
  }, [branchActive]);

  if (hasChildren) {
    return (
      <Collapsible
        open={!collapsed && open}
        onOpenChange={setOpen}
        className="flex flex-col gap-0.5"
      >
        <CollapsibleTrigger
          disabled={item.disabled}
          title={collapsed ? item.label : undefined}
          className={cn(parentClassName(branchActive, item.disabled, collapsed), "group")}
          onClick={(event) => {
            // Collapsed rail: first click re-opens the sidebar instead of the submenu.
            if (collapsed) {
              event.preventDefault();
              onExpand?.();
            }
          }}
        >
          <span className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-4">
            {item.icon}
          </span>
          <span className={cn("ms-2 min-w-0 flex-1 truncate text-left", collapsed && "sr-only")}>
            {item.label}
          </span>
          <ChevronDownIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
              collapsed && "hidden",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-0.5 py-2">
          {item.children!.map((child) => (
            <NavLink
              key={child.id}
              item={child}
              isActive={child.id === activeId}
              className={childClassName(child.id === activeId, child.disabled)}
              onItemSelect={onItemSelect}
              renderLink={renderLink}
            >
              <span className="min-w-0 flex-1 truncate text-left">{child.label}</span>
            </NavLink>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <NavLink
      item={item}
      isActive={isActive}
      className={parentClassName(isActive, item.disabled, collapsed)}
      onItemSelect={onItemSelect}
      renderLink={renderLink}
    >
      <span
        title={collapsed ? item.label : undefined}
        className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-4"
      >
        {item.icon}
      </span>
      <span className={cn("ms-2 min-w-0 flex-1 truncate text-left", collapsed && "sr-only")}>
        {item.label}
      </span>
    </NavLink>
  );
}

/**
 * Dreams ERP–aligned application sidebar.
 * Pass `items` (+ optional `type: "section"`) and `activeId`; spacing/active styles stay in the library.
 *
 * Collapsible by default: the header toggle shrinks the sidebar to an icon-only rail
 * (uncontrolled via `defaultCollapsed`, or controlled with `collapsed` + `onCollapsedChange`).
 */
export function AppSidebar({
  items,
  activeId,
  onItemSelect,
  renderLink,
  logo,
  footer,
  className,
  navLabel = "Main",
  collapsible = true,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
}: AppSidebarProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultCollapsed);
  const collapsed = collapsible && (collapsedProp ?? uncontrolled);

  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setUncontrolled(next);
    onCollapsedChange?.(next);
  };

  return (
    <aside
      data-slot="app-sidebar"
      data-collapsed={collapsed || undefined}
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden rounded-md border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-200",
        collapsed ? "w-16" : "w-(--spacing-sidenav)",
        className,
      )}
    >
      <div
        data-slot="app-sidebar-logo"
        className={cn(
          "flex h-(--spacing-topbar) shrink-0 items-center gap-2 border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        {collapsed ? null : <div className="min-w-0 flex-1">{logo ?? <DefaultLogo />}</div>}
        {collapsible ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="shrink-0 text-muted-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
          </Button>
        ) : null}
      </div>

      <nav
        data-slot="app-sidebar-nav"
        aria-label={navLabel}
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3"
      >
        {items.map((item) => (
          <NavItemRow
            key={item.id}
            item={item}
            activeId={activeId}
            onItemSelect={onItemSelect}
            renderLink={renderLink}
            collapsed={collapsed}
            onExpand={() => setCollapsed(false)}
          />
        ))}
      </nav>

      {footer ? (
        <div
          data-slot="app-sidebar-footer"
          className={cn(
            "mt-auto flex shrink-0 flex-col gap-2 border-t border-sidebar-border p-3",
            collapsed && "items-center px-2",
          )}
        >
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
