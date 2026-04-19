import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/scrap", label: "Scrap" },
  { href: "/note", label: "Note" },
  { href: "/tags", label: "Tags" },
];

export function Header() {
  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 mb-8 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)]/80 px-6 py-3 shadow-sm backdrop-blur-xl">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-[var(--fg)]"
      >
        ssshhhooota
      </Link>
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
