/**
 * Blog utilities — Make Real Progress
 * Reads blog posts from the server API (backed by Supabase).
 * Falls back to the bundled JSON data if the API is unavailable.
 */

import blogPostsData from "../data/blog-posts.json";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishDate?: string;
  publishedAt?: string;
  published: boolean;
  author: string;
  tags: string[];
  readTime: string;
}

// ─── In-memory cache (seeded from bundled JSON, refreshed from API) ───────────
let allPosts: BlogPost[] = (blogPostsData as any[]).map(normalizePost);
let cacheLoaded = false;

function normalizePost(p: any): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category || "Uncategorized",
    excerpt: p.excerpt || "",
    content: p.content,
    publishDate: p.publishDate || p.publishedAt || new Date().toISOString().split("T")[0],
    publishedAt: p.publishDate || p.publishedAt,
    published: p.published ?? true,
    author: p.author || "Wanda Gaines",
    tags: p.tags || [],
    readTime: p.readTime || "5 min read",
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "mrp-admin-2026";

async function fetchPublicPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("/api/blog/public");
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return (data as any[]).map(normalizePost);
  } catch {
    return [];
  }
}

async function fetchAdminPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`/api/blog/posts?adminPassword=${encodeURIComponent(ADMIN_PASSWORD)}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return (data as any[]).map(normalizePost);
  } catch {
    return [];
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Load published posts from the API and refresh the in-memory cache.
 * Returns the posts immediately from cache while loading.
 */
export async function loadPosts(): Promise<BlogPost[]> {
  const apiPosts = await fetchPublicPosts();
  if (apiPosts.length > 0) {
    // Merge: API posts take priority; keep any local drafts not yet synced
    const apiSlugs = new Set(apiPosts.map((p) => p.slug));
    const localOnly = allPosts.filter((p) => !apiSlugs.has(p.slug) && !p.published);
    allPosts = [...apiPosts, ...localOnly];
    cacheLoaded = true;
  }
  return getAllPosts();
}

export async function loadAdminPosts(): Promise<BlogPost[]> {
  const apiPosts = await fetchAdminPosts();
  if (apiPosts.length > 0) {
    allPosts = apiPosts;
    cacheLoaded = true;
  }
  return getAllPostsAdmin();
}

export function getAllPosts(): BlogPost[] {
  return allPosts
    .filter((p) => p.published)
    .sort((a, b) => {
      const da = new Date(b.publishDate || b.publishedAt || 0).getTime();
      const db2 = new Date(a.publishDate || a.publishedAt || 0).getTime();
      return da - db2;
    });
}

export function getAllPostsAdmin(): BlogPost[] {
  return [...allPosts].sort((a, b) => {
    const da = new Date(b.publishDate || b.publishedAt || 0).getTime();
    const db2 = new Date(a.publishDate || a.publishedAt || 0).getTime();
    return da - db2;
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug && p.published);
}

export function getPostBySlugAdmin(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  const cats = new Set(allPosts.filter((p) => p.published).map((p) => p.category));
  return Array.from(cats).sort();
}

export function getPostsByCategory(category: string): BlogPost[] {
  return allPosts
    .filter((p) => p.published && p.category === category)
    .sort((a, b) => {
      const da = new Date(b.publishDate || b.publishedAt || 0).getTime();
      const db2 = new Date(a.publishDate || a.publishedAt || 0).getTime();
      return da - db2;
    });
}

// ─── Admin mutations (call API, then update local cache) ──────────────────────

export function savePost(post: BlogPost): void {
  const idx = allPosts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) {
    allPosts[idx] = post;
  } else {
    allPosts = [post, ...allPosts];
  }
}

export function deletePost(slug: string): void {
  allPosts = allPosts.filter((p) => p.slug !== slug);
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
