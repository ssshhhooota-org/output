import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import {
  getAllNotePages,
  getNotesByPage,
  getNoteBySlug,
  getNoteSlugs,
  extractHeadings,
} from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";
import { NoteLayout } from "@/components/NoteLayout";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const pages = getAllNotePages();
  const params: { page: string; slug: string }[] = [];
  for (const page of pages) {
    for (const slug of getNoteSlugs(page)) {
      params.push({ page, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string; slug: string }>;
}) {
  const { page, slug } = await params;
  const { meta } = getNoteBySlug(page, slug);
  return {
    title: `${meta.title} | ${page.replace(/_/g, " ")} | ssshhhooota blog`,
  };
}

export default async function NoteSlugPage({
  params,
}: {
  params: Promise<{ page: string; slug: string }>;
}) {
  const { page, slug } = await params;

  let noteData;
  try {
    noteData = getNoteBySlug(page, slug);
  } catch {
    notFound();
  }

  const { meta, content } = noteData;
  const headings = extractHeadings(content);
  const allNotes = getNotesByPage(page);

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
    <NoteLayout
      currentPage={page}
      currentSlug={slug}
      notes={allNotes.map((n) => ({ slug: n.slug, title: n.title }))}
      headings={headings}
    >
      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{meta.title}</h1>
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
    </NoteLayout>
  );
}
