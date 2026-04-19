import { getAllPosts, getAllScraps, getAllNotes, type EntryMeta } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function Home() {
  const posts: (EntryMeta & { basePath: string })[] = getAllPosts().map(
    (e) => ({ ...e, basePath: "/blog" })
  );
  const scraps: (EntryMeta & { basePath: string })[] = getAllScraps().map(
    (e) => ({ ...e, basePath: "/scrap" })
  );
  const notes: (EntryMeta & { basePath: string })[] = getAllNotes().map(
    (e) => ({ ...e, basePath: `/note/${e.page}` })
  );

  const all = [...posts, ...scraps, ...notes].sort((a, b) =>
    b.created.localeCompare(a.created)
  );

  return (
    <section>
      <h1 className="sr-only">記事一覧</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
