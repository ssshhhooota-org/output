import Link from "next/link";
import { getAllNotes } from "@/lib/posts";

export default function NoteListPage() {
  const notes = getAllNotes();

  // Group by category
  const grouped = new Map<string, typeof notes>();
  for (const note of notes) {
    const list = grouped.get(note.category) ?? [];
    list.push(note);
    grouped.set(note.category, list);
  }

  return (
    <section>
      <h1 className="mb-6 text-xl font-bold">Note</h1>
      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([category, categoryNotes]) => (
          <div key={category}>
            <h2 className="mb-3 text-base font-semibold text-[var(--accent)]">
              {category.replace(/_/g, " ")}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {categoryNotes.map((note) => (
                <div
                  key={note.slug}
                  className="group relative rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
                >
                  <Link
                    href={`/note/${note.category}/${note.slug}`}
                    className="absolute inset-0 z-0"
                    aria-label={note.title}
                  />
                  <div className="mb-1 text-xs text-[var(--sub)]">
                    {note.created}
                  </div>
                  <div className="text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {note.title}
                  </div>
                  {note.tags.length > 0 && (
                    <div className="relative z-10 mt-2 flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
