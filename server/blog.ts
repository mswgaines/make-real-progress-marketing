/**
 * Blog API — Make Real Progress
 * Endpoints for saving and deleting blog posts via Supabase.
 * Protected by admin password.
 */
import { Router, Request, Response } from "express";

const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "mrp-admin-2026";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

// Helper: call Supabase REST API with service role key
async function supabaseQuery(
  method: string,
  table: string,
  body?: object,
  params?: Record<string, string>,
  extraHeaders?: Record<string, string>
): Promise<{ data: any; status: number; error?: string }> {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  if (params && Object.keys(params).length > 0) {
    url += "?" + new URLSearchParams(params).toString();
  }

  const res = await fetch(url, {
    method,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    return { data: null, status: res.status, error: data?.message || text };
  }
  return { data, status: res.status };
}

// Map DB row → client BlogPost shape
function dbToPost(row: any) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content,
    author: row.author || "Wanda Gaines",
    category: row.category || "Uncategorized",
    tags: row.tags || [],
    published: row.published ?? false,
    publishDate: row.publish_date,
    readTime: `${row.read_time} min read`,
  };
}

// Map client BlogPost → DB row shape
function postToDb(post: any) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content,
    author: post.author || "Wanda Gaines",
    category: post.category || "Uncategorized",
    tags: post.tags || [],
    published: post.published ?? false,
    publish_date: post.publishDate || new Date().toISOString().split("T")[0],
    read_time: parseInt(String(post.readTime || "5").split(" ")[0]) || 5,
    updated_at: new Date().toISOString(),
  };
}

export function blogRouter(): Router {
  const router = Router();

  // GET /api/blog/posts — list all posts (admin)
  router.get("/posts", async (req: Request, res: Response) => {
    const { adminPassword } = req.query;
    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { data, status, error } = await supabaseQuery(
      "GET",
      "blog_posts",
      undefined,
      { select: "*", order: "publish_date.desc" }
    );

    if (error) {
      console.error("[blog/posts] Error:", error);
      return res.status(status).json({ error });
    }

    return res.json(Array.isArray(data) ? data.map(dbToPost) : []);
  });

  // GET /api/blog/public — list published posts (public, no auth needed)
  router.get("/public", async (_req: Request, res: Response) => {
    const { data, status, error } = await supabaseQuery(
      "GET",
      "blog_posts",
      undefined,
      {
        select: "slug,title,excerpt,author,category,tags,publish_date,read_time",
        published: "eq.true",
        order: "publish_date.desc",
      }
    );

    if (error) {
      console.error("[blog/public] Error:", error);
      return res.status(status).json({ error });
    }

    return res.json(Array.isArray(data) ? data.map(dbToPost) : []);
  });

  // GET /api/blog/post/:slug — get single published post
  router.get("/post/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { data, status, error } = await supabaseQuery(
      "GET",
      "blog_posts",
      undefined,
      { select: "*", slug: `eq.${slug}`, published: "eq.true", limit: "1" }
    );

    if (error) {
      return res.status(status).json({ error });
    }

    const post = Array.isArray(data) ? data[0] : null;
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(dbToPost(post));
  });

  // POST /api/blog/save — create or update a post
  router.post("/save", async (req: Request, res: Response) => {
    const { post, adminPassword } = req.body;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!post || !post.slug || !post.title || !post.content) {
      return res.status(400).json({ error: "Missing required fields: slug, title, content" });
    }

    const dbRow = postToDb(post);

    const { data, status, error } = await supabaseQuery(
      "POST",
      "blog_posts",
      dbRow,
      undefined,
      { Prefer: "resolution=merge-duplicates,return=representation" }
    );

    if (error) {
      console.error("[blog/save] Error:", error);
      return res.status(status).json({ error });
    }

    return res.json({ success: true, slug: post.slug });
  });

  // POST /api/blog/delete — delete a post
  router.post("/delete", async (req: Request, res: Response) => {
    const { slug, adminPassword } = req.body;

    if (adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }

    const { status, error } = await supabaseQuery(
      "DELETE",
      "blog_posts",
      undefined,
      { slug: `eq.${slug}` }
    );

    if (error) {
      console.error("[blog/delete] Error:", error);
      return res.status(status).json({ error });
    }

    return res.json({ success: true });
  });

  return router;
}
