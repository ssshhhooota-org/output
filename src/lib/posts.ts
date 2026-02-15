import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type EntryMeta = {
  slug: string;
  title: string;
  created: string;
  updated: string;
  tags: string[];
  thumbnail: string;
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

// ```ts:hoge.ts → ```ts title="hoge.ts"
function normalizeCodeBlocks(content: string): string {
  return content.replace(/```(\w+):(.+)/g, '```$1 title="$2"');
}

function getEntry(kind: ContentKind, slug: string): { meta: EntryMeta; content: string } {
  slug = decodeURIComponent(slug);
  const filePath = path.join(getDir(kind), `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: extractTitle(slug, content),
      created: data.created ?? "",
      updated: data.updated ?? "",
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
        title: extractTitle(slug, content),
        created: data.created ?? "",
        updated: data.updated ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        thumbnail: parseThumbnail(data.thumbnail),
      };
    })
    .filter((e): e is EntryMeta => e !== null)
    .sort((a, b) => (a.created > b.created ? -1 : 1));
}

// Blog
export const getPostSlugs = () => getSlugs("blog");
export const getPostBySlug = (slug: string) => getEntry("blog", slug);
export const getAllPosts = () => getAllEntries("blog");

// Scrap
export const getScrapSlugs = () => getSlugs("scrap");
export const getScrapBySlug = (slug: string) => getEntry("scrap", slug);
export const getAllScraps = () => getAllEntries("scrap");
