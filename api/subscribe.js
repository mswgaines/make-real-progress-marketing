export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email required" });
  }

  const KIT_API_KEY = process.env.KIT_API_KEY;
  const KIT_FORM_ID = "2721d9624f";

  if (!KIT_API_KEY) {
    console.error("KIT_API_KEY not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const kitRes = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          email: email.trim(),
          first_name: firstName?.trim() || undefined,
        }),
      }
    );

    const data = await kitRes.json();

    if (kitRes.ok && data.subscription) {
      return res.status(200).json({ success: true });
    } else {
      console.error("Kit API error:", data);
      return res.status(400).json({ error: data.message || "Subscription failed" });
    }
  } catch (err) {
    console.error("Kit API fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
