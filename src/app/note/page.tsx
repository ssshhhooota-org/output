import Link from "next/link";
import { getAllNotePages, getNotesByPage } from "@/lib/posts";

export default function NoteListPage() {
  const pages = getAllNotePages();

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Note</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {pages.map((p) => {
          const notes = getNotesByPage(p);
          const tags = [...new Set(notes.flatMap((n) => n.tags))];

          return (
            <div
              key={p}
              className="group relative rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
            >
              <Link
                href={`/note/${p}`}
                className="absolute inset-0 z-0"
                aria-label={p.replace(/_/g, " ")}
              />
              <div className="mb-1 text-xs text-[var(--sub)]">
                {notes.length} notes
              </div>
              <h2 className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                {p.replace(/_/g, " ")}
              </h2>
              {tags.length > 0 && (
                <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
