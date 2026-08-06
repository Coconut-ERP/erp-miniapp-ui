import Link from "next/link";
import { cn } from "@erp/miniapp-ui/cn";
import { NAV } from "@/lib/nav";

export function DocsShell({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="min-h-dvh bg-surface text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
          <Link href="/" className="font-semibold tracking-tight">
            @erp/miniapp-ui
          </Link>
          <nav className="hidden gap-4 text-sm text-muted-foreground sm:flex">
            <Link href="/foundations/colors" className="hover:text-foreground">
              Foundations
            </Link>
            <Link href="/components" className="hover:text-foreground">
              Components
            </Link>
            <Link href="/patterns" className="hover:text-foreground">
              Patterns
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden max-h-[calc(100dvh-5.5rem)] overflow-y-auto lg:sticky lg:top-20 lg:block">
          {NAV.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activeHref === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                          active && "bg-muted font-medium text-foreground",
                          !active && "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
