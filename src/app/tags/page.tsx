import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section>
      <h1 className="text-xl font-bold mb-6">タグ一覧</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded text-sm transition-colors"
          >
            <span>{tag}</span>
            <span className="text-neutral-400 text-xs">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
