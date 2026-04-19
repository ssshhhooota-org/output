import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type EntryMeta = {
  slug: string;
  title: string;
  created: string;
  updated: string;
  tags: string[];
  thumbnail: string;
};

export type TocHeading = {
  level: number;
  text: string;
  id: string;
};

type ContentKind = "blog" | "scrap";

function getDir(kind: ContentKind) {
  return path.join(CONTENT_DIR, kind);
}

function extractTitle(slug: string, content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : slug;
}

function stripTitle(content: string): string {
  return content.replace(/^#\s+.+$/m, "").trimStart();
}

function parseThumbnail(raw: string | undefined): string {
  if (!raw) return "";
  const match = raw.match(/\[\[(.+?)\]\]/);
  return match ? match[1] : raw;
}

export function extractHeadings(content: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: slugger.slug(match[2]),
    });
  }
  return headings;
}

// ```ts:hoge.ts → ```ts title="hoge.ts"
function normalizeCodeBlocks(content: string): string {
  return content.replace(/```(\w+):(.+)/g, '```$1 title="$2"');
}

function parseDate(raw: unknown): string {
  if (!raw) return "";
  return String(raw).split(" ")[0];
}

function getEntry(kind: ContentKind, slug: string): { meta: EntryMeta; content: string } {
  slug = decodeURIComponent(slug);
  const filePath = path.join(getDir(kind), `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title || extractTitle(slug, content),
      created: parseDate(data.created),
      updated: parseDate(data.updated),
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: parseThumbnail(data.thumbnail),
    },
    content: normalizeCodeBlocks(stripTitle(content)),
  };
}

function getSlugs(kind: ContentKind): string[] {
  const dir = getDir(kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function getAllEntries(kind: ContentKind): EntryMeta[] {
  return getSlugs(kind)
    .map((slug) => {
      const filePath = path.join(getDir(kind), `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      if (data.public === false) return null;
      return {
        slug,
        title: data.title || extractTitle(slug, content),
        created: parseDate(data.created),
        updated: parseDate(data.updated),
        tags: Array.isArray(data.tags) ? data.tags : [],
        thumbnail: parseThumbnail(data.thumbnail),
      };
    })
    .filter((e): e is EntryMeta => e !== null)
    .sort((a, b) => b.created.localeCompare(a.created));
}

// Blog
export const getPostSlugs = () => getSlugs("blog");
export const getPostBySlug = (slug: string) => getEntry("blog", slug);
export const getAllPosts = () => getAllEntries("blog");

// Scrap
export const getScrapSlugs = () => getSlugs("scrap");
export const getScrapBySlug = (slug: string) => getEntry("scrap", slug);
export const getAllScraps = () => getAllEntries("scrap");

// Tags
export function getAllTags(): { tag: string; count: number }[] {
  const all = [...getAllEntries("blog"), ...getAllEntries("scrap")];
  const counts = new Map<string, number>();
  for (const entry of all) {
    for (const tag of entry.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getEntriesByTag(tag: string): (EntryMeta & { basePath: string })[] {
  const posts = getAllEntries("blog")
    .filter((e) => e.tags.includes(tag))
    .map((e) => ({ ...e, basePath: "/blog" }));
  const scraps = getAllEntries("scrap")
    .filter((e) => e.tags.includes(tag))
    .map((e) => ({ ...e, basePath: "/scrap" }));
  return [...posts, ...scraps].sort((a, b) => b.created.localeCompare(a.created));
}

// Note
// Notes are organized in subdirectories: content/note/<page>/<slug>.md
export type NoteMeta = EntryMeta & { page: string };

function getNoteDir() {
  return path.join(CONTENT_DIR, "note");
}

export function getAllNotePages(): string[] {
  const dir = getNoteDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getNoteSlugs(page: string): string[] {
  const dir = path.join(getNoteDir(), page);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getNoteBySlug(page: string, slug: string): { meta: NoteMeta; content: string } {
  const filePath = path.join(getNoteDir(), page, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      page,
      title: extractTitle(slug, content),
      created: parseDate(data.created),
      updated: parseDate(data.updated),
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: parseThumbnail(data.thumbnail),
    },
    content: normalizeCodeBlocks(stripTitle(content)),
  };
}

export function getNotesByPage(page: string): NoteMeta[] {
  const notes: NoteMeta[] = [];
  for (const slug of getNoteSlugs(page)) {
    const filePath = path.join(getNoteDir(), page, `${slug}.md`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (data.public === false) continue;
    notes.push({
      slug,
      page,
      title: extractTitle(slug, content),
      created: parseDate(data.created),
      updated: parseDate(data.updated),
      tags: Array.isArray(data.tags) ? data.tags : [],
      thumbnail: parseThumbnail(data.thumbnail),
    });
  }
  return notes.sort((a, b) => b.created.localeCompare(a.created));
}

export function getAllNotes(): NoteMeta[] {
  const pages = getAllNotePages();
  const notes: NoteMeta[] = [];
  for (const page of pages) {
    notes.push(...getNotesByPage(page));
  }
  return notes.sort((a, b) => b.created.localeCompare(a.created));
}
