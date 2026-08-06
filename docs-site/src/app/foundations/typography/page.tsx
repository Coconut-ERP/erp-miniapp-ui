import { DocsShell } from "@/components/docs-shell";

const SCALE = [
  { label: "Page title", className: "text-xl font-semibold tracking-tight" },
  { label: "Section title", className: "text-base font-semibold" },
  { label: "Body", className: "text-sm" },
  { label: "Helper", className: "text-xs text-muted-foreground" },
  { label: "Label", className: "text-sm font-medium" },
] as const;

export default function TypographyPage() {
  return (
    <DocsShell activeHref="/foundations/typography">
      <article className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Typography</h1>
          <p className="max-w-2xl text-muted-foreground">
            System sans stack with a compact UI scale. Controls default to <code className="text-xs">text-sm</code>.
          </p>
        </header>
        <div className="divide-y divide-border rounded-xl border border-border bg-background">
          {SCALE.map((row) => (
            <div key={row.label} className="grid gap-2 px-4 py-5 sm:grid-cols-[180px_1fr] sm:items-center">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {row.label}
              </p>
              <p className={row.className}>The quick brown fox jumps over the lazy dog</p>
            </div>
          ))}
        </div>
      </article>
    </DocsShell>
  );
}
