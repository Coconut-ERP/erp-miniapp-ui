"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { Demo } from "@/components/demo";
import { PropsApiTable } from "@/components/props-api-table";
import { componentDocs } from "@/registry/components";
import { patternDocs } from "@/registry/patterns";
import { componentProps } from "@/registry/props";
import type { DocSpec } from "@/lib/doc-types";

function DocPageView({
  spec,
  href,
  slug,
}: {
  spec: DocSpec;
  href: string;
  slug?: string;
}) {
  const props = spec.props ?? (slug ? componentProps[slug] : undefined);

  return (
    <DocsShell activeHref={href}>
      <article className="space-y-10">
        <header className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{spec.title}</h1>
          <p className="max-w-2xl text-muted-foreground">{spec.description}</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-background px-3 py-2 text-xs">
            <code>{spec.importLine}</code>
          </pre>
          {spec.related?.length ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Related
              </p>
              <ul className="flex flex-wrap gap-2 text-sm">
                {spec.related.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-primary hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {spec.demos.length > 1 ? (
            <nav className="flex flex-wrap gap-2 pt-1">
              {spec.demos.map((demo) => (
                <a
                  key={demo.title}
                  href={`#${slugify(demo.title)}`}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {demo.title}
                </a>
              ))}
              {props?.length ? (
                <a
                  href="#api"
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  API
                </a>
              ) : null}
            </nav>
          ) : null}
        </header>

        <div className="space-y-10">
          {spec.demos.map((demo) => (
            <div key={demo.title} id={slugify(demo.title)} className="scroll-mt-24">
              <Demo
                title={demo.title}
                description={demo.description}
                code={demo.code}
                className={demo.className}
              >
                {demo.render()}
              </Demo>
            </div>
          ))}
        </div>

        {spec.accessibility?.length ? (
          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-lg font-semibold">Accessibility</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {spec.accessibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {props?.length ? <PropsApiTable props={props} /> : null}

        {spec.api?.length ? (
          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-lg font-semibold">Exports</h2>
            <ul className="flex flex-wrap gap-2">
              {spec.api.map((item) => (
                <li key={item}>
                  <code className="rounded-md bg-muted px-2 py-1 text-xs text-foreground">{item}</code>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </DocsShell>
  );
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ComponentDocPage({ slug }: { slug: string }) {
  const spec = componentDocs[slug];
  if (!spec) notFound();
  return <DocPageView spec={spec} href={`/components/${slug}`} slug={slug} />;
}

export function PatternDocPage({ slug }: { slug: string }) {
  const spec = patternDocs[slug];
  if (!spec) notFound();
  return <DocPageView spec={spec} href={`/patterns/${slug}`} />;
}
