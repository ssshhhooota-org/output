import Link from "next/link";
import type { EntryMeta } from "@/lib/posts";

export function PostCard({
  entry,
  basePath,
}: {
  entry: EntryMeta;
  basePath: string;
}) {
  return (
    <article>
      <Link href={`${basePath}/${entry.slug}`} className="group block py-4">
        <div className="flex items-center gap-2">
          <time className="text-sm text-neutral-500">{entry.created}</time>
          <span className={`text-xs px-1.5 py-0.5 rounded ${basePath === "/blog" ? "bg-neutral-200 text-neutral-600" : "bg-amber-100 text-amber-700"}`}>
            {basePath === "/blog" ? "blog" : "scrap"}
          </span>
        </div>
        <h2 className="text-lg font-medium group-hover:underline">
          {entry.title}
        </h2>
      </Link>
    </article>
  );
}
