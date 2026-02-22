import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getPostBySlug, getPostSlugs, extractHeadings } from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";
import { TableOfContents } from "@/components/TableOfContents";

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
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const headings = extractHeadings(content);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-light" }]],
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
        <TableOfContents headings={headings} />
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
