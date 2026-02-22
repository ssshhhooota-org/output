import type { TocHeading } from "@/lib/posts";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="mt-4 border-l-2 border-neutral-200 pl-4">
      <ul className="flex flex-col gap-1 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${h.id}`}
              className="text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
