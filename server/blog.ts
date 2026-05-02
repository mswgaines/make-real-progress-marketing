/**
 * Blog API — Make Real Progress
 * Endpoints for saving and deleting blog posts via Supabase.
 * Protected by admin password.
 *
 * Also provides:
 *  - GET /api/blog/sitemap.xml  — dynamic sitemap generated from Supabase
 *  - Auto-pings Google on article publish
 */
import { Router, Request, Response } from "express";

const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "mrp-admin-2026";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SITE_BASE = "https://www.makerealprogressapp.com";

// Static pages to always include in the sitemap
const STATIC_PAGES = [
  { loc: `${SITE_BASE}/`,     changefreq: "weekly",  priority: "1.0" },
  { loc: `${SITE_BASE}/book`, changefreq: "monthly", priority: "0.9" },
  { loc: `${SITE_BASE}/blog`, changefreq: "weekly",  priority: "0.9" },
];

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

// Ping Google to notify of a new/updated URL
async function pingGoogle(articleSlug: string) {
  const articleUrl = `${SITE_BASE}/blog/${articleSlug}`;
  const sitemapUrl = `${SITE_BASE}/sitemap.xml`;

  try {
    // Ping Google with the sitemap URL (classic ping)
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(pingUrl, { method: "GET" });
    console.log(`[blog/ping] Google sitemap ping: ${res.status} for ${articleUrl}`);
  } catch (err) {
    // Non-fatal — don't fail the save if ping fails
    console.warn("[blog/ping] Google ping failed (non-fatal):", err);
  }
}

export function blogRouter(): Router {
  const router = Router();

  // ── Dynamic sitemap ──────────────────────────────────────────────────────────
  // GET /api/blog/sitemap.xml — served by Express, then index.ts re-exposes
  // at /sitemap.xml via a redirect (see server/index.ts)
  router.get("/sitemap.xml", async (_req: Request, res: Response) => {
    const today = new Date().toISOString().split("T")[0];

    // Fetch all published posts
    const { data, error } = await supabaseQuery(
      "GET",
      "blog_posts",
      undefined,
      {
        select: "slug,publish_date,updated_at",
        published: "eq.true",
        order: "publish_date.desc",
      }
    );

    const posts: Array<{ slug: string; publish_date: string; updated_at: string }> =
      error || !Array.isArray(data) ? [] : data;

    const staticUrls = STATIC_PAGES.map(
      (p) => `
  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ).join("");

    const articleUrls = posts
      .map(
        (p) => `
  <url>
    <loc>${SITE_BASE}/blog/${p.slug}</loc>
    <lastmod>${(p.updated_at || p.publish_date || today).split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${articleUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1 hour
    return res.send(xml);
  });

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

    // If the article is being published, ping Google automatically
    if (post.published) {
      pingGoogle(post.slug); // fire-and-forget, non-blocking
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
