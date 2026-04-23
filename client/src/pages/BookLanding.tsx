/**
 * /book — QR Code Landing Page
 * Design: "The Journey" — Warm Editorial Premium
 * Purpose: Guide book readers into the companion app
 * Mobile-first, minimal friction, max conversion
 *
 * Palette: Parchment #F8F4EE | Forest Green #2C4A2E | Golden Amber #C8922A
 * Fonts: Playfair Display (headings) + DM Sans (body)
 */

import { ArrowRight, CheckCircle2, BookOpen, Smartphone, Star } from "lucide-react";
import { Link } from "wouter";

const BOOK_COVER = "/book-cover.png";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028299362/8f2AFUYYmh8YHsaePtEs9B/hero-bg-4go5Z5fZdfELki9FUYzhvW.webp";

export default function BookLanding() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] flex flex-col">
      {/* Minimal header — brand only, no nav distractions */}
      <header className="bg-[#F8F4EE] border-b border-[#2C4A2E]/10 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/">
            <span
              className="font-bold text-[#2C4A2E]"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
            >
              Make Real Progress
            </span>
          </Link>
          <a
            href="https://app.makerealprogressapp.com"
            className="text-[#2C4A2E] text-sm font-medium hover:text-[#C8922A] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign In
          </a>
        </div>
      </header>

      {/* ================================================================
          HERO — Welcome from the book
          ================================================================ */}
      <section
        className="relative py-10 px-5 overflow-hidden"
        style={{
          background: `url(${HERO_BG}) center/cover no-repeat`,
        }}
      >
        <div className="absolute inset-0 bg-[#F8F4EE]/80" />

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 bg-[#2C4A2E] text-[#F8F4EE] rounded-full px-4 py-1.5 mb-6">
            <BookOpen size={13} />
            <span
              className="text-xs font-medium tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Welcome, Reader
            </span>
          </div>

          {/* Book cover + headline */}
          <div className="flex items-start gap-5 mb-7">
            <img
              src={BOOK_COVER}
              alt="Make Real Progress book cover"
              className="w-24 flex-shrink-0 rounded-lg"
              style={{ boxShadow: "0 8px 32px oklch(0.22 0.05 145 / 0.3)" }}
            />
            <div>
                <h1
                className="text-[#1A2E1A] leading-tight mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                  fontWeight: 700,
                }}
              >
                You've got the book.<br />
                <span className="italic text-[#C8922A]">Now start tracking your progress.</span>
              </h1>
              <p
                className="text-[#2C4A2E]/70 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Track your debt. See your progress. Stay motivated every step of the way.
              </p>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col gap-3 mb-6">
            <a
              href="https://app.makerealprogressapp.com/register"
              className="btn-forest-solid text-base w-full justify-center"
            >
              Create Free Account
              <ArrowRight size={17} />
            </a>
            <a
              href="https://app.makerealprogressapp.com"
              className="btn-forest text-base w-full justify-center"
            >
              Sign In to Existing Account
            </a>
          </div>

          <p
            className="text-[#2C4A2E]/50 text-xs text-center mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Free to use. No credit card required. Start in under 2 minutes.
          </p>

          {/* Paperback recommendation card */}
          <div
            className="bg-[#FFFDF9] rounded-xl p-4 border border-[#2C4A2E]/10"
            style={{ boxShadow: "0 2px 12px oklch(0.31 0.072 145 / 0.07)" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-base">📘</span>
              <div>
                <p
                  className="text-[#2C4A2E]/50 text-xs font-medium uppercase tracking-wide mb-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Recommended starting point
                </p>
                <p
                  className="text-[#1A2E1A] font-semibold text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Start here: Read the book first.
                </p>
                <p
                  className="text-[#2C4A2E]/60 text-xs mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Start from the beginning and follow the full plan step by step.
                </p>
              </div>
            </div>
            <a
              href="https://amzn.to/3OVorkI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2C4A2E] border border-[#2C4A2E]/30 rounded-lg px-4 py-2 text-xs font-medium hover:bg-[#2C4A2E]/5 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              🛒 Get the paperback on Amazon
              <ArrowRight size={13} />
            </a>
            <p
              className="text-[#2C4A2E]/40 text-xs mt-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Best experience: the full workbook-style paperback
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          WHAT THE APP DOES
          ================================================================ */}
      <section className="py-10 px-5 bg-[#F8F4EE]">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-[#1A2E1A] font-bold text-xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What the companion app does
          </h2>

          <div className="space-y-4">
            {[
              {
                title: "Track your debt payoff",
                desc: "Log your balances and watch them shrink. The tracker is built around the exact framework in the book.",
              },
              {
                title: "Celebrate every milestone",
                desc: "Progress isn't linear — the app recognizes every win, big or small, to keep you motivated.",
              },
              {
                title: "See your full picture",
                desc: "A clear dashboard shows how far you've come and what's next on your journey.",
              },
              {
                title: "Works with every chapter",
                desc: "Each section of the app corresponds to the book, so you always know exactly where you are.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-[#FFFDF9] rounded-xl p-4"
                style={{ boxShadow: "0 2px 12px oklch(0.31 0.072 145 / 0.07)" }}
              >
                <CheckCircle2 size={18} className="text-[#C8922A] flex-shrink-0 mt-0.5" />
                <div>
                  <h4
                    className="text-[#1A2E1A] font-semibold text-sm mb-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[#2C4A2E]/60 text-xs leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW TO GET STARTED
          ================================================================ */}
      <section className="py-10 px-5 bg-[#EDE8DF]">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-[#1A2E1A] font-bold text-xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Getting started takes 2 minutes
          </h2>

          <div className="space-y-4">
            {[
              { step: "1", text: "Create your free account — no credit card needed" },
              { step: "2", text: "Set up your debt tracker using the numbers from Chapter 2" },
              { step: "3", text: "Log your first win and start making real progress" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full bg-[#2C4A2E] text-[#F8F4EE] flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.step}
                </div>
                <p
                  className="text-[#2C4A2E]/80 text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          MINI TESTIMONIAL
          ================================================================ */}
      <section className="py-10 px-5 bg-[#F8F4EE]">
        <div className="max-w-lg mx-auto">
          <div
            className="bg-[#FFFDF9] rounded-2xl p-6"
            style={{ boxShadow: "0 4px 24px oklch(0.31 0.072 145 / 0.08)" }}
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="text-[#C8922A] fill-[#C8922A]" />
              ))}
            </div>
            <p
              className="text-[#2C4A2E]/80 text-sm leading-relaxed italic mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              "The app made the book come alive. I could actually see my progress in real time — it kept me going when I wanted to quit."
            </p>
            <p
              className="text-[#2C4A2E]/50 text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Reader Review — Amazon Verified Purchase
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          STICKY BOTTOM CTA (mobile)
          ================================================================ */}
      <div className="sticky bottom-0 left-0 right-0 bg-[#F8F4EE]/95 backdrop-blur-sm border-t border-[#2C4A2E]/10 px-5 py-4 z-50">
        <div className="max-w-lg mx-auto flex gap-3">
          <a
            href="https://app.makerealprogressapp.com/register"
            className="btn-forest-solid flex-1 text-sm py-3 justify-center"
          >
            <Smartphone size={15} />
            Create Free Account
          </a>
          <a
            href="https://app.makerealprogressapp.com"
            className="btn-forest text-sm py-3 px-4"
          >
            Sign In
          </a>
        </div>
      </div>

      {/* ================================================================
          MINIMAL FOOTER
          ================================================================ */}
      <footer className="bg-[#1A2E1A] px-5 py-6 mt-auto">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[#F8F4EE]/40 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © {new Date().getFullYear()} Make Real Progress by Wanda Gaines
          </p>
          <div className="flex gap-4">
            <Link href="/">
              <span
                className="text-[#F8F4EE]/40 hover:text-[#C8922A] text-xs transition-colors cursor-pointer"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Home
              </span>
            </Link>
            <a
              href="#"
              className="text-[#F8F4EE]/40 hover:text-[#C8922A] text-xs transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
