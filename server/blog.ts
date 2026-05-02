/**
 * Blog API — Make Real Progress
 * Endpoints for saving and deleting blog posts from the JSON data file.
 * Protected by admin password.
 */

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DATA_PATH = path.resolve(__dirname, "../client/src/data/blog-posts.json");
const ADMIN_PASSWORD = "mrp-admin-2026";

export function blogRouter(): Router {
  const router = Router();

  // Save (create or update) a blog post
  router.post("/save", (req: Request, res: Response) => {
    const { post, adminPassword } = req.body;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!post || !post.slug || !post.title || !post.content) {
      return res.status(400).json({ error: "Missing required fields: slug, title, content" });
    }

    try {
      let posts: any[] = [];
      if (fs.existsSync(BLOG_DATA_PATH)) {
        const raw = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
        posts = JSON.parse(raw);
      }

      const idx = posts.findIndex((p: any) => p.slug === post.slug);
      if (idx >= 0) {
        posts[idx] = post;
      } else {
        posts.unshift(post);
      }

      fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(posts, null, 2), "utf-8");
      return res.json({ success: true, slug: post.slug });
    } catch (err: any) {
      console.error("[blog/save] Error:", err);
      return res.status(500).json({ error: "Failed to save post" });
    }
  });

  // Delete a blog post
  router.post("/delete", (req: Request, res: Response) => {
    const { slug, adminPassword } = req.body;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }

    try {
      let posts: any[] = [];
      if (fs.existsSync(BLOG_DATA_PATH)) {
        const raw = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
        posts = JSON.parse(raw);
      }

      posts = posts.filter((p: any) => p.slug !== slug);
      fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(posts, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[blog/delete] Error:", err);
      return res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Get all posts (admin)
  router.get("/posts", (req: Request, res: Response) => {
    const { adminPassword } = req.query;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      let posts: any[] = [];
      if (fs.existsSync(BLOG_DATA_PATH)) {
        const raw = fs.readFileSync(BLOG_DATA_PATH, "utf-8");
        posts = JSON.parse(raw);
      }
      return res.json(posts);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to read posts" });
    }
  });

  return router;
}
