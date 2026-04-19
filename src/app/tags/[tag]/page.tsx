import { getAllTags, getEntriesByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const entries = getEntriesByTag(decoded);

  if (entries.length === 0) notFound();

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold text-[var(--accent)]">
        #{decoded}
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <PostCard
            key={`${entry.basePath}-${entry.slug}`}
            entry={entry}
            basePath={entry.basePath}
          />
        ))}
      </div>
    </section>
  );
}
