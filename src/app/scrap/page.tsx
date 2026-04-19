import { getAllScraps, type EntryMeta } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function ScrapListPage() {
  const scraps: (EntryMeta & { basePath: string })[] = getAllScraps().map((e) => ({
    ...e,
    basePath: "/scrap",
  }));

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Scrap</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {scraps.map((entry) => (
          <PostCard key={entry.slug} entry={entry} basePath={entry.basePath} />
        ))}
      </div>
    </section>
  );
}
