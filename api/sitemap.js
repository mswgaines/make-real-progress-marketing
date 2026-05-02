/**
 * GET /api/sitemap
 * Returns a dynamic XML sitemap generated from Supabase.
 * The vercel.json rewrite maps /sitemap.xml → /api/sitemap
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://isjoascxdwadvlfgmuhk.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SITE_BASE = "https://www.makerealprogressapp.com";

const STATIC_PAGES = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/book", priority: "0.9", changefreq: "monthly" },
  { url: "/blog", priority: "0.9", changefreq: "daily" },
];

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // Fetch all published slugs from Supabase
    const params = new URLSearchParams({
      select: "slug,publish_date,updated_at",
      published: "eq.true",
      order: "publish_date.desc",
    });

    const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?${params}`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    const posts = response.ok ? await response.json() : [];

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${SITE_BASE}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ).join("\n");

    const blogUrls = Array.isArray(posts)
      ? posts
          .map((post) => {
            const lastmod = (post.updated_at || post.publish_date || today).split("T")[0];
            return `  <url>
    <loc>${SITE_BASE}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
          })
          .join("\n")
      : "";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).send(xml);
  } catch (err) {
    console.error("[sitemap] Error:", err);
    return res.status(500).send("<?xml version=\"1.0\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>");
  }
}
