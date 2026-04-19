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
                <Link
                  key={note.slug}
                  href={`/note/${note.category}/${note.slug}`}
                  className="group block rounded-lg border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
                >
                  <div className="mb-1 text-xs text-[var(--sub)]">
                    {note.created}
                  </div>
                  <div className="text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {note.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
