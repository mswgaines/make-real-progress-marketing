import React, { useState } from "react";
import { Download, CheckCircle, ArrowRight, BookOpen, Target, TrendingUp, Loader2 } from "lucide-react";

const KIT_FORM_UID = "2721d9624f";

const CHECKLIST_ITEMS = [
  "The 3-step framework to stop the debt cycle for good",
  "A simple monthly budget template you'll actually use",
  "The Debt Priority Worksheet — know exactly what to pay first",
  "Quick-win strategies to free up $100+ per month",
  "The mindset reset that makes everything else easier",
];

export default function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      // Submit via our server-side API route which calls Kit's v3 API
      // This properly triggers the incentive/confirmation email
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
        }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (response.ok && data.success) {
        setStatus("success");
        // PDF is delivered by Kit's incentive email after email confirmation
        // No auto-download here — subscriber must confirm their email first
      } else {
        console.error("Subscribe error:", data);
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="free-starter-kit"
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A2E1A 0%, #2C4A2E 50%, #1A2E1A 100%)" }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C8922A 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #C8922A 0%, transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-8 h-px bg-[#C8922A]" />
          <span
            className="text-[#C8922A] text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Free Download
          </span>
          <div className="w-8 h-px bg-[#C8922A]" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <h2
              className="text-[#F8F4EE] leading-tight mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
              }}
            >
              Get Your Free<br />
              <span className="italic text-[#C8922A]">Debt-Free Starter Kit</span>
            </h2>

            <p
              className="text-[#F8F4EE]/70 text-base leading-relaxed mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Everything you need to take your first real step toward financial freedom.
              No fluff, no judgment — just practical tools that work for real people.
            </p>

            <div className="space-y-3 mb-8">
              {CHECKLIST_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#C8922A] flex-shrink-0 mt-0.5" />
                  <span
                    className="text-[#F8F4EE]/80 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#C8922A", "#2C4A2E", "#8B7355"].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#1A2E1A] flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {["M", "S", "J"][i]}
                  </div>
                ))}
              </div>
              <span
                className="text-[#F8F4EE]/50 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Join thousands of readers on their debt-free journey
              </span>
            </div>
          </div>

          {/* Right: Form card */}
          <div>
            <div
              className="rounded-3xl p-8"
              style={{
                background: "rgba(248, 244, 238, 0.06)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(248, 244, 238, 0.12)",
              }}
            >
              {/* PDF preview badge */}
              <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl" style={{ background: "rgba(200, 146, 42, 0.12)", border: "1px solid rgba(200, 146, 42, 0.2)" }}>
                <div className="w-12 h-12 rounded-xl bg-[#C8922A] flex items-center justify-center flex-shrink-0">
                  <Download size={22} className="text-white" />
                </div>
                <div>
                  <div
                    className="text-[#F8F4EE] font-semibold text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Debt-Free Starter Kit
                  </div>
                  <div
                    className="text-[#C8922A] text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Free PDF — Instant Download
                  </div>
                </div>
              </div>

              {status === "success" ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#C8922A]/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-[#C8922A]" />
                  </div>
                  <h3
                    className="text-[#F8F4EE] font-bold text-xl mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Check your inbox!
                  </h3>
                  <p
                    className="text-[#F8F4EE]/70 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    We sent a confirmation email to <span className="text-[#C8922A]">{email}</span>. Click the link inside to confirm and receive your free Debt-Free Starter Kit.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[#F8F4EE]/70 text-xs font-medium mb-1.5 uppercase tracking-wide"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(248, 244, 238, 0.08)",
                        border: "1px solid rgba(248, 244, 238, 0.15)",
                        color: "#F8F4EE",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1px solid rgba(200, 146, 42, 0.6)";
                        e.target.style.background = "rgba(248, 244, 238, 0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "1px solid rgba(248, 244, 238, 0.15)";
                        e.target.style.background = "rgba(248, 244, 238, 0.08)";
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#F8F4EE]/70 text-xs font-medium mb-1.5 uppercase tracking-wide"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Email Address <span className="text-[#C8922A]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(248, 244, 238, 0.08)",
                        border: "1px solid rgba(248, 244, 238, 0.15)",
                        color: "#F8F4EE",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1px solid rgba(200, 146, 42, 0.6)";
                        e.target.style.background = "rgba(248, 244, 238, 0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "1px solid rgba(248, 244, 238, 0.15)";
                        e.target.style.background = "rgba(248, 244, 238, 0.08)";
                      }}
                    />
                  </div>

                  {errorMsg && (
                    <p
                      className="text-red-400 text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !email.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: status === "loading" || !email.trim() ? "rgba(200, 146, 42, 0.5)" : "#C8922A",
                      color: "#1A2E1A",
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: status === "loading" || !email.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending your kit...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Send Me the Free Kit
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p
                    className="text-[#F8F4EE]/40 text-xs text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    No spam, ever. Unsubscribe anytime. Your email is safe with us.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
