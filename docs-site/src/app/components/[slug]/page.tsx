import { ComponentDocPage } from "@/components/doc-page";
import { NAV } from "@/lib/nav";

export function generateStaticParams() {
  return (
    NAV.find((g) => g.title === "Components")?.items.map((item) => ({
      slug: item.href.replace("/components/", ""),
    })) ?? []
  );
}

export default async function ComponentDocRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ComponentDocPage slug={slug} />;
}
