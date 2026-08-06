import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { NAV } from "@/lib/nav";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@erp/miniapp-ui";

export default function HomePage() {
  const foundations = NAV.find((g) => g.title === "Foundations")?.items ?? [];
  const components = NAV.find((g) => g.title === "Components")?.items ?? [];
  const patterns = NAV.find((g) => g.title === "Patterns")?.items ?? [];

  return (
    <DocsShell activeHref="/">
      <div className="space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-medium text-primary">Design system</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
            @erp/miniapp-ui showcase
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Live previews, copy-paste code, and API notes for every foundation token, component, and
            pattern — similar to Material UI component docs.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/components/button">Browse components</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/foundations/colors">Colors</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Foundations</CardTitle>
              <CardDescription>{foundations.length} pages</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {foundations.map((item) => (
                <Link key={item.href} href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>{components.length} live demos</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Accordion → Tooltip, including forms, overlays, and data display.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Patterns</CardTitle>
              <CardDescription>{patterns.length} compositions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {patterns.map((item) => (
                <Link key={item.href} href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </DocsShell>
  );
}
