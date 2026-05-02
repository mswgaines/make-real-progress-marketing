/**
 * GET /api/blog/posts?adminPassword=xxx
 * Returns all blog posts (admin only).
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "mrp-admin-2026";

function dbToPost(row) {
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { adminPassword } = req.query;
  if (adminPassword !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });

  try {
    const params = new URLSearchParams({ select: "*", order: "publish_date.desc" });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?${params}`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: "Failed to fetch posts" });
    }

    const data = await response.json();
    return res.status(200).json(Array.isArray(data) ? data.map(dbToPost) : []);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
