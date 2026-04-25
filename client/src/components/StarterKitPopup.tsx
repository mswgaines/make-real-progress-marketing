import React, { useState, useEffect } from "react";
import { Download, CheckCircle, ArrowRight, X, Loader2 } from "lucide-react";

const CHECKLIST_ITEMS = [
  "The 3-step framework to stop the debt cycle for good",
  "A simple monthly budget template you'll actually use",
  "The Debt Priority Worksheet — know exactly what to pay first",
  "Quick-win strategies to free up $100+ per month",
];

const STORAGE_KEY = "mrp_popup_dismissed";

export default function StarterKitPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already_subscribed" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Don't show if already dismissed in this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Show after 4 seconds
    const timer = setTimeout(() => {
      setVisible(true);
      // Slight delay for animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setAnimateIn(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
        }),
      });

      const data = await response.json() as { success?: boolean; already_subscribed?: boolean; error?: string };

      if (response.ok && data.success) {
        if (data.already_subscribed) {
          setStatus("already_subscribed");
        } else {
          setStatus("success");
        }
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 9998,
          opacity: animateIn ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: animateIn
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -48%) scale(0.96)",
          opacity: animateIn ? 1 : 0,
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: 9999,
          width: "min(92vw, 520px)",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "24px",
          background: "linear-gradient(145deg, #1A2E1A 0%, #2C4A2E 60%, #1A2E1A 100%)",
          border: "1px solid rgba(200, 146, 42, 0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,146,42,0.1)",
          padding: "32px",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(248,244,238,0.1)",
            border: "1px solid rgba(248,244,238,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#F8F4EE",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,244,238,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,244,238,0.1)")}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "24px", height: "1px", background: "#C8922A" }} />
            <span style={{
              color: "#C8922A",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Free Download
            </span>
            <div style={{ width: "24px", height: "1px", background: "#C8922A" }} />
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#F8F4EE",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}>
            Get Your Free<br />
            <span style={{ color: "#C8922A", fontStyle: "italic" }}>Debt-Free Starter Kit</span>
          </h2>

          <p style={{
            color: "rgba(248,244,238,0.65)",
            fontSize: "14px",
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Everything you need to take your first real step toward financial freedom — no fluff, no judgment.
          </p>
        </div>

        {/* Checklist */}
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {CHECKLIST_ITEMS.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckCircle size={14} style={{ color: "#C8922A", flexShrink: 0, marginTop: "2px" }} />
              <span style={{
                color: "rgba(248,244,238,0.75)",
                fontSize: "13px",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.5,
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* PDF badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "14px",
          background: "rgba(200, 146, 42, 0.1)",
          border: "1px solid rgba(200, 146, 42, 0.2)",
          marginBottom: "20px",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#C8922A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Download size={18} style={{ color: "white" }} />
          </div>
          <div>
            <div style={{ color: "#F8F4EE", fontWeight: 600, fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
              Debt-Free Starter Kit
            </div>
            <div style={{ color: "#C8922A", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
              Free PDF — Instant Download
            </div>
          </div>
        </div>

        {/* Form or success state */}
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(200,146,42,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <CheckCircle size={28} style={{ color: "#C8922A" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE", fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>
              Check your inbox!
            </h3>
            <p style={{ color: "rgba(248,244,238,0.65)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              We sent a confirmation email to <span style={{ color: "#C8922A" }}>{email}</span>. Click the link to confirm and receive your free kit.
            </p>
          </div>
        ) : status === "already_subscribed" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(200,146,42,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <CheckCircle size={28} style={{ color: "#C8922A" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#F8F4EE", fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>
              You're already in!
            </h3>
            <p style={{ color: "rgba(248,244,238,0.65)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              <span style={{ color: "#C8922A" }}>{email}</span> is already confirmed. Check your previous email for your Starter Kit download link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{
                display: "block",
                color: "rgba(248,244,238,0.6)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(248,244,238,0.07)",
                  border: "1px solid rgba(248,244,238,0.14)",
                  color: "#F8F4EE",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(200,146,42,0.6)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(248,244,238,0.14)")}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "rgba(248,244,238,0.6)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Email Address <span style={{ color: "#C8922A" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(248,244,238,0.07)",
                  border: "1px solid rgba(248,244,238,0.14)",
                  color: "#F8F4EE",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(200,146,42,0.6)")}
                onBlur={(e) => (e.target.style.border = "1px solid rgba(248,244,238,0.14)")}
              />
            </div>

            {errorMsg && (
              <p style={{ color: "#f87171", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px 24px",
                borderRadius: "12px",
                background: status === "loading" || !email.trim() ? "rgba(200,146,42,0.5)" : "#C8922A",
                color: "#1A2E1A",
                fontWeight: 700,
                fontSize: "14px",
                fontFamily: "'DM Sans', sans-serif",
                cursor: status === "loading" || !email.trim() ? "not-allowed" : "pointer",
                border: "none",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                if (status !== "loading" && email.trim()) {
                  e.currentTarget.style.background = "#d4a03a";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = status === "loading" || !email.trim() ? "rgba(200,146,42,0.5)" : "#C8922A";
                e.currentTarget.style.transform = "translateY(0)";
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

            <p style={{
              color: "rgba(248,244,238,0.35)",
              fontSize: "11px",
              textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              No spam, ever. Unsubscribe anytime. Your email is safe with us.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
