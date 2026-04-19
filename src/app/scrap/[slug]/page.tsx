import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getScrapBySlug, getScrapSlugs } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";

export async function generateStaticParams() {
  return getScrapSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getScrapBySlug(slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function ScrapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getScrapBySlug(slug);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" } }],
        ],
      },
    },
  });

  return (
    <article>
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            scrap
          </span>
          <time>作成: {meta.created}</time>
          {meta.updated && meta.updated !== meta.created && <time>更新: {meta.updated}</time>}
        </div>
        <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
        {meta.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {meta.tags.map((tag) => (
              <a
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs text-neutral-500 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 px-2 py-0.5 rounded transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        )}
      </header>
      <CodeBlockEnhancer>
        <div className="prose prose-neutral max-w-none dark:prose-invert">{mdxContent}</div>
      </CodeBlockEnhancer>
    </article>
  );
}
