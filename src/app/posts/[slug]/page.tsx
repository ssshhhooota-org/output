import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
    description: meta.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]],
      },
    },
  });

  return (
    <article>
      <header className="mb-8">
        <time className="text-sm text-neutral-500">{meta.date}</time>
        <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
        {meta.tags.length > 0 && (
          <div className="mt-2 flex gap-2">
            {meta.tags.map((tag) => (
              <span key={tag} className="text-sm text-neutral-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="prose prose-neutral max-w-none">{mdxContent}</div>
    </article>
  );
}
