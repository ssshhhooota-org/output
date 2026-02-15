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
        <time className="text-sm text-neutral-500">{entry.created}</time>
        <h2 className="text-lg font-medium group-hover:underline">
          {entry.title}
        </h2>
      </Link>
    </article>
  );
}
