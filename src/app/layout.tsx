import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "ssshhhooota blog",
  description: "Personal tech blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <div className="mt-auto mx-auto w-full max-w-5xl px-4">
          <Footer />
        </div>
      </body>
    </html>
  );
}
