import Link from "next/link";
import type { EntryMeta } from "@/lib/posts";

export function PostCard({
  entry,
  basePath,
}: {
  entry: EntryMeta;
  basePath: string;
}) {
  const isBlog = basePath === "/blog";

  return (
    <article>
      <Link
        href={`${basePath}/${entry.slug}`}
        className="group block rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${
              isBlog
                ? "text-[var(--accent)]"
                : "text-[var(--amber)]"
            }`}
          >
            {isBlog ? "blog" : "scrap"}
          </span>
          <span className="text-xs text-[var(--sub)]">{entry.created}</span>
        </div>
        <h2 className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
          {entry.title}
        </h2>
        {entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
