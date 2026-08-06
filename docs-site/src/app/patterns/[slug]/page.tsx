import { PatternDocPage } from "@/components/doc-page";
import { NAV } from "@/lib/nav";

export function generateStaticParams() {
  return (
    NAV.find((g) => g.title === "Patterns")?.items.map((item) => ({
      slug: item.href.replace("/patterns/", ""),
    })) ?? []
  );
}

export default async function PatternDocRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PatternDocPage slug={slug} />;
}
