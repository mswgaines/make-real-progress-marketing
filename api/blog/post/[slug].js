/**
 * GET /api/blog/post/[slug]
 * Returns a single published blog post by slug.
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const params = new URLSearchParams({
      select: "*",
      slug: `eq.${slug}`,
      published: "eq.true",
      limit: "1",
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
      console.error("[blog/post] Supabase error:", error);
      return res.status(500).json({ error: "Failed to fetch post" });
    }

    const data = await response.json();
    const post = Array.isArray(data) ? data[0] : null;
    if (!post) return res.status(404).json({ error: "Post not found" });

    return res.status(200).json(dbToPost(post));
  } catch (err) {
    console.error("[blog/post] Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
