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
  const KIT_API_SECRET = process.env.KIT_API_SECRET;
  const KIT_FORM_ID = "9362994";

  if (!KIT_API_KEY) {
    console.error("KIT_API_KEY not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Step 1: Check if subscriber already exists and is confirmed (active)
    if (KIT_API_SECRET) {
      const checkRes = await fetch(
        `https://api.convertkit.com/v3/subscribers?api_secret=${KIT_API_SECRET}&email_address=${encodeURIComponent(email.trim())}`,
        { method: "GET" }
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const existing = checkData.subscribers?.[0];
        if (existing && existing.state === "active") {
          // Already confirmed — no need to re-subscribe
          return res.status(200).json({ success: true, already_subscribed: true });
        }
      }
    }

    // Step 2: Subscribe to the form (new or unconfirmed subscriber)
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
      return res.status(200).json({ success: true, already_subscribed: false });
    } else {
      console.error("Kit API error:", data);
      return res.status(400).json({ error: data.message || "Subscription failed" });
    }
  } catch (err) {
    console.error("Kit API fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
