import { DocsShell } from "@/components/docs-shell";
import { ColorTokenGrid } from "@/components/color-token-grid";
import { groupColorTokens, readRootColorTokens } from "@/lib/color-tokens";

export default function ColorsPage() {
  const tokens = readRootColorTokens();
  const groups = groupColorTokens(tokens);

  return (
    <DocsShell activeHref="/foundations/colors">
      <article className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Colors</h1>
          <p className="max-w-2xl text-muted-foreground">
            All color tokens parsed from{" "}
            <code className="text-xs">packages/miniapp-ui/src/styles/globals.css</code>{" "}
            (<code className="text-xs">:root</code>). Swatches use{" "}
            <code className="text-xs">var(--token)</code> live — add a variable in globals and it
            appears here automatically.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{tokens.length}</span> color tokens
          </p>
        </header>
        <ColorTokenGrid groups={groups} />
      </article>
    </DocsShell>
  );
}
