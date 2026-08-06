"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button, cn } from "@erp/miniapp-ui";

export function Demo({
  title,
  description,
  code,
  children,
  className,
}: {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <section className="scroll-mt-24 space-y-3 border-b border-border pb-10 last:border-b-0">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div
        className={cn(
          "flex min-h-28 flex-wrap items-center justify-center gap-4 rounded-xl border border-border bg-background p-8",
          className,
        )}
      >
        {children}
      </div>
      <div className="relative overflow-hidden rounded-xl border border-border bg-foreground/[0.03]">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute top-2 right-2"
          aria-label={copied ? "Copied" : "Copy code"}
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </section>
  );
}
