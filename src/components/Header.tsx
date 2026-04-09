import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="py-8 flex items-center justify-between">
      <Link href="/" className="text-lg font-bold tracking-tight">
        ssshhhooota
      </Link>
      <ThemeToggle />
    </header>
  );
}
