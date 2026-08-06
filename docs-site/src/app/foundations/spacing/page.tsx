import { DocsShell } from "@/components/docs-shell";

export default function SpacingPage() {
  const spaces = [1, 2, 3, 4, 6, 8, 10, 12] as const;
  const radii = [
    { name: "sm", className: "rounded-sm" },
    { name: "md", className: "rounded-md" },
    { name: "lg", className: "rounded-lg" },
    { name: "xl", className: "rounded-xl" },
    { name: "2xl", className: "rounded-2xl" },
  ] as const;

  return (
    <DocsShell activeHref="/foundations/spacing">
      <article className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Spacing & radius</h1>
          <p className="text-muted-foreground">Tailwind spacing scale and theme radius tokens.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Spacing</h2>
          <div className="space-y-3">
            {spaces.map((n) => (
              <div key={n} className="flex items-center gap-4 text-sm">
                <code className="w-16 text-muted-foreground">{n}</code>
                <div className="h-4 rounded bg-primary" style={{ width: `${n * 4}px` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Radius</h2>
          <div className="flex flex-wrap gap-4">
            {radii.map((r) => (
              <div key={r.name} className="space-y-2 text-center text-xs text-muted-foreground">
                <div className={`size-16 border border-border bg-card ${r.className}`} />
                <code>{r.name}</code>
              </div>
            ))}
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
