import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Tags</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 text-sm text-[var(--fg)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {tag}
            <span className="ml-1.5 text-xs text-[var(--sub)]">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
