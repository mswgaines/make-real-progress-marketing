/**
 * POST /api/blog/save
 * Creates or updates a blog post. Admin only.
 * Also pings Google when article is published.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "mrp-admin-2026";
const SITE_BASE = "https://www.makerealprogressapp.com";

function postToDb(post) {
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

async function pingGoogle() {
  try {
    const sitemapUrl = `${SITE_BASE}/sitemap.xml`;
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log("[blog/save] Google pinged successfully");
  } catch (err) {
    console.warn("[blog/save] Google ping failed (non-fatal):", err);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { post, adminPassword } = req.body || {};
  if (adminPassword !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
  if (!post || !post.slug || !post.title || !post.content) {
    return res.status(400).json({ error: "Missing required fields: slug, title, content" });
  }

  try {
    const dbRow = postToDb(post);
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(dbRow),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[blog/save] Supabase error:", error);
      return res.status(500).json({ error: "Failed to save post" });
    }

    // Ping Google if publishing
    if (post.published) {
      pingGoogle(); // fire-and-forget
    }

    return res.status(200).json({ success: true, slug: post.slug });
  } catch (err) {
    console.error("[blog/save] Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
