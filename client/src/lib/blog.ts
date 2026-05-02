/**
 * Blog utilities — Make Real Progress
 * Handles reading, creating, and managing blog posts from the JSON data store.
 */

import blogPostsData from "../data/blog-posts.json";

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  published: boolean;
  author: string;
  tags: string[];
  readTime: string;
}

// Load all posts from the JSON data file
let allPosts: BlogPost[] = blogPostsData as BlogPost[];

export function getAllPosts(): BlogPost[] {
  return allPosts
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getAllPostsAdmin(): BlogPost[] {
  return [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

// Admin: save posts back to in-memory store (for session persistence)
// In production, this would call an API endpoint to write to the JSON file
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
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
