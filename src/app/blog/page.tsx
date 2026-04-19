import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default function BlogListPage() {
  const posts = getAllPosts().map((e) => ({ ...e, basePath: "/blog" }));

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Blog</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((entry) => (
          <PostCard
            key={entry.slug}
            entry={entry}
            basePath={entry.basePath}
          />
        ))}
      </div>
    </section>
  );
}
