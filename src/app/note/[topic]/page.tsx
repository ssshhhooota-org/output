import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import {
  getAllNoteTopics,
  getNotesByTopic,
  getNoteBySlug,
} from "@/lib/posts";
import { CodeBlockEnhancer } from "@/components/CodeBlockEnhancer";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllNoteTopics().map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  return {
    title: `${topic.replace(/_/g, " ")} | ssshhhooota blog`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const notes = getNotesByTopic(topic);

  if (notes.length === 0) notFound();

  const tags = [...new Set(notes.flatMap((n) => n.tags))];

  const renderedNotes = await Promise.all(
    notes.map(async (note) => {
      const { content } = getNoteBySlug(topic, note.slug);
      const { content: mdxContent } = await compileMDX({
        source: content,
        options: {
          mdxOptions: {
            format: "md",
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                { theme: { light: "github-light", dark: "github-dark-dimmed" } },
              ],
            ],
          },
        },
      });
      return { meta: note, mdxContent };
    })
  );

  return (
    <article>
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-[var(--sub)]">
          <span className="text-xs font-semibold text-[var(--accent)]">
            note
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold">
          {topic.replace(/_/g, " ")}
        </h1>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
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
      <div className="space-y-12">
        {renderedNotes.map(({ meta, mdxContent }) => (
          <section key={meta.slug}>
            <h2 className="mb-4 text-xl font-bold border-b border-[var(--border)] pb-2">
              {meta.title}
            </h2>
            <CodeBlockEnhancer>
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                {mdxContent}
              </div>
            </CodeBlockEnhancer>
          </section>
        ))}
      </div>
    </article>
  );
}
