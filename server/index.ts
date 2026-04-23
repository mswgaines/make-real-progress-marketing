import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Kit email subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    const { email, firstName } = req.body;

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
      // Use Kit v3 API to subscribe to the specific form
      // This properly triggers the incentive/confirmation email
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

      const data = await kitRes.json() as { subscription?: { id: number }; error?: string; message?: string };

      if (kitRes.ok && data.subscription) {
        return res.json({ success: true });
      } else {
        console.error("Kit API error:", data);
        return res.status(400).json({ error: data.message || "Subscription failed" });
      }
    } catch (err) {
      console.error("Kit API fetch error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
