import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold text-[var(--accent)]">404</h1>
      <p className="mt-4 text-lg text-[var(--sub)]">ページが見つかりませんでした</p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-6 py-2.5 text-sm text-[var(--fg)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        トップに戻る
      </Link>
    </div>
  );
}
