"use client";

import type { PropDef } from "@/lib/doc-types";

export function PropsApiTable({ props }: { props: PropDef[] }) {
  return (
    <section id="api" className="scroll-mt-24 space-y-4 border-t border-border pt-8">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">API</h2>
        <p className="text-sm text-muted-foreground">
          Props reference for this component (MUI-style). Composition children are listed where
          relevant.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-3 py-2.5 font-medium">Name</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Default</th>
              <th className="px-3 py-2.5 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-t border-border align-top">
                <td className="px-3 py-3 font-mono text-xs font-medium text-primary">{prop.name}</td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground break-all">
                  {prop.type}
                </td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                  {prop.default ?? "—"}
                </td>
                <td className="px-3 py-3 text-muted-foreground">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
