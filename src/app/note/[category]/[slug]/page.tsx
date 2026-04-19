import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import {
  getNoteBySlug,
  getAllNoteCategories,
  getNoteSlugs,
} from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";

export async function generateStaticParams() {
  const categories = getAllNoteCategories();
  const params: { category: string; slug: string }[] = [];
  for (const category of categories) {
    for (const slug of getNoteSlugs(category)) {
      params.push({ category, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const { meta } = getNoteBySlug(category, slug);
  return {
    title: `${meta.title} | ssshhhooota blog`,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const { meta, content } = getNoteBySlug(category, slug);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        format: "md",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            { theme: { light: "github-light", dark: "github-dark-dimmed" } },
          ],
        ],
      },
    },
  });

  return (
    <article>
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-[var(--sub)]">
          <span className="text-xs font-semibold text-[var(--accent)]">
            note
          </span>
          <span className="text-xs text-[var(--sub)]">
            {category.replace(/_/g, " ")}
          </span>
          <time>作成: {meta.created}</time>
          {meta.updated && meta.updated !== meta.created && (
            <time>更新: {meta.updated}</time>
          )}
        </div>
        <h1 className="mt-1 text-2xl font-bold">{meta.title}</h1>
      </header>
      <CodeBlockEnhancer>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {mdxContent}
        </div>
      </CodeBlockEnhancer>
    </article>
  );
}
