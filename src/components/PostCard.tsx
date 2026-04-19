import Link from "next/link";
import type { EntryMeta } from "@/lib/posts";

export function PostCard({ entry, basePath }: { entry: EntryMeta; basePath: string }) {
  return (
    <article className="py-4">
      <Link href={`${basePath}/${entry.slug}`} className="group block">
        <div className="flex items-center gap-2">
          <time className="text-sm text-neutral-500">{entry.created}</time>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${basePath === "/blog" ? "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"}`}
          >
            {basePath === "/blog" ? "blog" : "scrap"}
          </span>
        </div>
        <h2 className="text-lg font-medium group-hover:underline">{entry.title}</h2>
      </Link>
      {entry.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="text-xs text-neutral-500 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 px-2 py-0.5 rounded transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
