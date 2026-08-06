"use client";

import { useEffect, useState } from "react";
import type { ColorToken } from "@/lib/color-token-utils";
import { textOnToken } from "@/lib/color-token-utils";

function ColorCard({ token, allNames }: { token: ColorToken; allNames: Set<string> }) {
  const [resolved, setResolved] = useState<string>("");

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${token.name}`)
      .trim();
    setResolved(value);
  }, [token.name]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div
        className="flex h-24 items-end p-3"
        style={{
          background: `var(--${token.name})`,
          color: textOnToken(token.name, allNames),
        }}
      >
        <span className="text-sm font-medium drop-shadow-sm">{token.name}</span>
      </div>
      <div className="space-y-1 p-3 text-xs text-muted-foreground">
        <p>
          <code className="text-foreground">--{token.name}</code>
        </p>
        <p>
          <code>bg-{token.name}</code>
          {" · "}
          <code>text-{token.name}</code>
        </p>
        <p className="break-all font-mono text-[11px] opacity-80" title={token.value}>
          {resolved || token.value}
        </p>
      </div>
    </div>
  );
}

export function ColorTokenGrid({
  groups,
}: {
  groups: { title: string; tokens: ColorToken[] }[];
}) {
  const allNames = new Set(groups.flatMap((g) => g.tokens.map((t) => t.name)));

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.title} className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">{group.title}</h2>
            <span className="text-xs text-muted-foreground">{group.tokens.length} tokens</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((token) => (
              <ColorCard key={token.name} token={token} allNames={allNames} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
