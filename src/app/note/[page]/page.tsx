import { redirect } from "next/navigation";
import {
  getAllNotePages,
  getNotesByPage,
} from "@/lib/posts";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllNotePages().map((page) => ({ page }));
}

export default async function NotePageRedirect({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const notes = getNotesByPage(page);

  if (notes.length === 0) notFound();

  redirect(`/note/${page}/${encodeURIComponent(notes[0].slug)}`);
}
