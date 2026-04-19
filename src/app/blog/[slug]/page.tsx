import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getPostBySlug, getPostSlugs, extractHeadings } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";
import { TocSidebar, TocDrawer } from "@/components/TableOfContents";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const headings = extractHeadings(content);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" } }],
        ],
      },
    },
  });

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-[var(--sub)]">
            <span className="text-xs font-semibold text-[var(--accent)]">blog</span>
            <time>作成: {meta.created}</time>
            {meta.updated && meta.updated !== meta.created && <time>更新: {meta.updated}</time>}
          </div>
          <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
          {meta.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {meta.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
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
      <TocSidebar headings={headings} />
      <TocDrawer headings={headings} />
    </div>
  );
}
