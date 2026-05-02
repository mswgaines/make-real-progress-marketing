/**
 * GET /api/blog/public
 * Returns all published blog posts (no auth required).
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

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
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const params = new URLSearchParams({
      select: "slug,title,excerpt,author,category,tags,published,publish_date,read_time",
      published: "eq.true",
      order: "publish_date.desc",
    });

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
      console.error("[blog/public] Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch posts" });
    }

    const data = await response.json();
    return res.status(200).json(Array.isArray(data) ? data.map(dbToPost) : []);
  } catch (err) {
    console.error("[blog/public] Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
