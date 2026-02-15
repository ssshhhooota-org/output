import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ssshhhooota blog",
  description: "Personal tech blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="mx-auto max-w-2xl px-4 antialiased">
        <Header />
        <main className="min-h-[60vh] py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
