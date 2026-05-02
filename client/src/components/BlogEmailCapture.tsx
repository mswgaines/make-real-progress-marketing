/**
 * BlogEmailCapture — Make Real Progress
 * Email capture form embedded at the bottom of every blog article.
 * Uses the existing /api/subscribe endpoint (Kit / ConvertKit).
 */

import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function BlogEmailCapture() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim() }),
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: "linear-gradient(135deg, #F8F4EE 0%, #EDE8E0 100%)",
            border: "1px solid rgba(44, 74, 46, 0.12)",
          }}
        >
          {status === "success" ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-[#2C4A2E] mx-auto mb-4" />
              <h3
                className="text-xl font-bold text-[#1A2E1A] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                You're in!
              </h3>
              <p
                className="text-[#2C4A2E]/70 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Check your inbox — your free Debt Payoff Starter Kit is on its way.
                <br />
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          ) : (
            /* ── Form state ── */
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              {/* Left: copy */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#C8922A]/15 flex items-center justify-center">
                    <Mail size={15} className="text-[#C8922A]" />
                  </div>
                  <span
                    className="text-xs font-semibold uppercase tracking-widest text-[#C8922A]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Free Resource
                  </span>
                </div>
                <h3
                  className="text-xl md:text-2xl font-bold text-[#1A2E1A] mb-2 leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Get the Free Debt Payoff Starter Kit
                </h3>
                <p
                  className="text-[#2C4A2E]/65 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  A simple toolkit to help you get started — includes a debt tracker worksheet,
                  payoff strategy guide, and budget template. Completely free.
                </p>
              </div>

              {/* Right: form */}
              <div className="flex-1 min-w-0">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors bg-white border border-[#2C4A2E]/15 focus:border-[#2C4A2E]/40 text-[#1A2E1A] placeholder:text-[#2C4A2E]/35"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors bg-white border border-[#2C4A2E]/15 focus:border-[#2C4A2E]/40 text-[#1A2E1A] placeholder:text-[#2C4A2E]/35"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {errorMsg && (
                    <p className="text-red-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading" || !email.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background:
                        status === "loading" || !email.trim()
                          ? "rgba(200, 146, 42, 0.5)"
                          : "#C8922A",
                      color: "#1A2E1A",
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: status === "loading" || !email.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Me the Free Kit
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p
                    className="text-[#2C4A2E]/40 text-xs text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
