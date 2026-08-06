import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { NAV } from "@/lib/nav";

export default function ComponentsIndexPage() {
  const items = NAV.find((g) => g.title === "Components")?.items ?? [];
  return (
    <DocsShell activeHref="/components">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Live demos for every primitive in @erp/miniapp-ui.
          </p>
        </header>
        <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </DocsShell>
  );
}
