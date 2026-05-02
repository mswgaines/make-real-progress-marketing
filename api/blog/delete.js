/**
 * POST /api/blog/delete
 * Deletes a blog post by slug. Admin only.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "mrp-admin-2026";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { slug, adminPassword } = req.body || {};
  if (adminPassword !== ADMIN_PASSWORD) return res.status(401).json({ error: "Unauthorized" });
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const params = new URLSearchParams({ slug: `eq.${slug}` });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?${params}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[blog/delete] Supabase error:", error);
      return res.status(500).json({ error: "Failed to delete post" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[blog/delete] Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
