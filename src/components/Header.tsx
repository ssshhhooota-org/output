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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-[var(--fg)]">
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
      </div>
    </header>
  );
}
