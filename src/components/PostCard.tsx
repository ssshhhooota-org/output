import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article>
      <Link href={`/posts/${post.slug}`} className="group block py-4">
        <time className="text-sm text-neutral-500">{post.date}</time>
        <h2 className="text-lg font-medium group-hover:underline">
          {post.title}
        </h2>
        <p className="text-sm text-neutral-600">{post.description}</p>
      </Link>
    </article>
  );
}
