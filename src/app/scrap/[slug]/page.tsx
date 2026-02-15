import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getScrapBySlug, getScrapSlugs } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";

export async function generateStaticParams() {
  return getScrapSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta } = getScrapBySlug(slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function ScrapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, content } = getScrapBySlug(slug);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]],
      },
    },
  });

  return (
    <article>
      <header className="mb-8">
        <div className="flex gap-4 text-sm text-neutral-500">
          <time>作成: {meta.created}</time>
          {meta.updated && meta.updated !== meta.created && (
            <time>更新: {meta.updated}</time>
          )}
        </div>
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
      <CodeBlockEnhancer>
        <div className="prose prose-neutral max-w-none">{mdxContent}</div>
      </CodeBlockEnhancer>
    </article>
  );
}
