import { getAllPosts, getAllScraps, type EntryMeta } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function Home() {
  const posts: (EntryMeta & { basePath: string })[] = getAllPosts().map(
    (e) => ({ ...e, basePath: "/blog" })
  );
  const scraps: (EntryMeta & { basePath: string })[] = getAllScraps().map(
    (e) => ({ ...e, basePath: "/scrap" })
  );

  const all = [...posts, ...scraps].sort((a, b) =>
    a.created > b.created ? -1 : 1
  );

  return (
    <section>
      <h1 className="sr-only">記事一覧</h1>
      <div className="divide-y divide-neutral-200">
        {all.map((entry) => (
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
