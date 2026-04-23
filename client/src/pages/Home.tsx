/**
 * Home Page — Make Real Progress
 * Design: "The Journey" — Warm Editorial Premium
 * Palette: Parchment #F8F4EE | Forest Green #2C4A2E | Golden Amber #C8922A | Sage #6B8F71
 * Fonts: Playfair Display (headings) + DM Sans (body)
 *
 * Sections:
 * 1. Hero — split layout, book cover + headline + CTAs
 * 2. Social proof bar
 * 3. What is this — book + app ecosystem
 * 4. Why different — progress over perfection
 * 5. How it works — 3-step journey
 * 6. App features
 * 7. About the Author — Wanda Gaines
 * 8. Testimonials placeholder
 * 9. FAQ accordion
 * 10. Final CTA band
 */

import { useState } from "react";
import { ChevronDown, BookOpen, Smartphone, ArrowRight, CheckCircle2, Star, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookQuiz from "@/components/BookQuiz";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Asset URLs
const BOOK_COVER = "/book-cover.png";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028299362/8f2AFUYYmh8YHsaePtEs9B/hero-bg-4go5Z5fZdfELki9FUYzhvW.webp";
const APP_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663028299362/8f2AFUYYmh8YHsaePtEs9B/app-mockup-bg-3XzWYurJ7j6PexmuicgqKs.webp";
const AUTHOR_FRAME = "/wanda-headshot.png";

// FAQ data
const faqs = [
  {
    q: "Who is this book for?",
    a: "Make Real Progress is for anyone who feels stuck with debt — whether you're just starting out, have tried other approaches, or simply don't know where to begin. No financial background required. No judgment. Just practical, honest guidance.",
  },
  {
    q: "What makes this different from other personal finance books?",
    a: "Most finance books tell you what to do but not how to actually do it when life gets in the way. Make Real Progress is built around real-life scenarios, judgment-free language, and a companion app that helps you track your actual progress — not a theoretical budget.",
  },
  {
    q: "What is the companion app?",
    a: "The Make Real Progress companion app is a free tool that works alongside the book. It helps you track your debt payoff journey, set milestones, and stay motivated with progress tracking designed specifically for the book's framework.",
  },
  {
    q: "Is the companion app really free?",
    a: "Yes. The core companion app is completely free to use. Create an account and start tracking your progress today — no credit card required.",
  },
  {
    q: "Where can I buy the book?",
    a: "Both the paperback and Kindle eBook are available now on Amazon. The paperback is the recommended experience — it's a full workbook-style edition designed to be used alongside the companion app. Click any 'Buy the Book' button to go directly to the Amazon listing.",
  },
  {
    q: "I already have the book — how do I get started with the app?",
    a: "Head to makerealprogressapp.com/book or scan the QR code inside your copy. You'll be guided through creating a free account and connecting your book to the app in minutes.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#2C4A2E]/15 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-[#1A2E1A] font-medium text-base group-hover:text-[#2C4A2E] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-[#C8922A] flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-64 pb-5" : "max-h-0"}`}
      >
        <p
          className="text-[#2C4A2E]/75 text-sm leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

// Scroll reveal section wrapper
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `url(${HERO_BG}) center/cover no-repeat`,
        }}
      >
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-[#F8F4EE]/70" />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-6rem)]">
            {/* Left: Headline + CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
              {/* Label */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-px bg-[#C8922A]" />
                <span className="section-label">New Book by Wanda Gaines</span>
              </div>

              {/* Headline */}
              <h1
                className="text-[#1A2E1A] leading-[1.05] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  fontWeight: 700,
                }}
              >
                Stop Surviving.<br />
                <span className="text-[#2C4A2E]">Start Making</span><br />
                <span
                  className="italic"
                  style={{ color: "#C8922A" }}
                >
                  Real Progress.
                </span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-[#2C4A2E]/80 text-lg leading-relaxed mb-8 max-w-lg"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                A practical, judgment-free guide to getting out of debt and staying out —
                paired with a free companion app that keeps you on track every step of the way.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="https://amzn.to/3OVorkI"
                  id="buy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-amber pulse-amber text-base"
                >
                  <BookOpen size={18} />
                  Buy the Book on Amazon
                </a>
                <a
                  href="https://app.makerealprogressapp.com"
                  className="btn-forest text-base"
                >
                  <Smartphone size={18} />
                  Try the App Free
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-6">
                {[
                  "Paperback — Available Now",
                  "Kindle eBook Available",
                  "Free Companion App",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#C8922A]" />
                    <span
                      className="text-[#2C4A2E]/70 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Book cover */}
            <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative glow */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "radial-gradient(ellipse at center, oklch(0.72 0.14 68 / 0.25) 0%, transparent 70%)",
                    transform: "scale(1.2)",
                    filter: "blur(30px)",
                  }}
                />
                <img
                  src={BOOK_COVER}
                  alt="Make Real Progress book cover by Wanda Gaines"
                  className="book-float relative z-10 rounded-xl"
                  style={{
                    maxWidth: "min(340px, 80vw)",
                    boxShadow: "0 32px 80px oklch(0.22 0.05 145 / 0.35), 0 8px 24px oklch(0.22 0.05 145 / 0.2)",
                    transform: "rotate(-1deg)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 wave-divider">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 60L1440 60L1440 20C1200 55 960 0 720 30C480 60 240 10 0 40L0 60Z" fill="#F8F4EE" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          SOCIAL PROOF BAR
          ================================================================ */}
      <section className="bg-[#F8F4EE] py-10 border-b border-[#2C4A2E]/10">
        <div className="container">
          <RevealSection>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {[
                { value: "Practical", label: "No fluff, just action" },
                { value: "Judgment-Free", label: "Start where you are" },
                { value: "Proven Framework", label: "Step-by-step system" },
                { value: "Free App", label: "Track your progress" },
              ].map((item) => (
                <div key={item.value} className="text-center reveal">
                  <div
                    className="text-[#C8922A] font-bold text-xl mb-0.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.value}
                  </div>
                  <div
                    className="text-[#2C4A2E]/60 text-xs uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          WHAT IS THIS — Book + App Ecosystem
          ================================================================ */}
      <section id="book" className="py-24 bg-[#F8F4EE]">
        <div className="container">
          <RevealSection>
            <div className="max-w-3xl mx-auto">
              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-4 reveal">
                  <div className="w-8 h-px bg-[#C8922A]" />
                  <span className="section-label">The Ecosystem</span>
                </div>

                <h2
                  className="text-[#1A2E1A] leading-tight mb-6 reveal"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 700,
                  }}
                >
                  A Book and an App,<br />
                  <span className="italic text-[#C8922A]">Built to Work Together</span>
                </h2>

                <p
                  className="text-[#2C4A2E]/75 text-base leading-relaxed mb-6 reveal"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Most finance books leave you inspired but lost. <em>Make Real Progress</em> is
                  different — it comes with a free companion app designed to take the framework
                  from the page and put it into practice in your actual life.
                </p>

                <div className="space-y-5 mb-8">
                  {[
                    {
                      icon: <BookOpen size={20} className="text-[#C8922A]" />,
                      title: "The Book",
                      desc: "A clear, practical guide to understanding your debt, building a real plan, and making progress that actually sticks — written without judgment.",
                    },
                    {
                      icon: <Smartphone size={20} className="text-[#C8922A]" />,
                      title: "The Companion App",
                      desc: "Track your debt payoff, celebrate milestones, and stay motivated with a tool built specifically to support the book's framework. Free to use.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 reveal">
                      <div className="w-10 h-10 rounded-lg bg-[#C8922A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <h4
                          className="text-[#1A2E1A] font-semibold mb-1"
                          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-[#2C4A2E]/65 text-sm leading-relaxed"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 reveal">
                  <a href="https://amzn.to/3OVorkI" target="_blank" rel="noopener noreferrer" className="btn-amber">
                    Buy the Book
                    <ArrowRight size={16} />
                  </a>
                  <a href="https://app.makerealprogressapp.com" className="btn-forest">
                    Get the App Free
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          WHY DIFFERENT — Progress Over Perfection
          ================================================================ */}
      <section className="py-24 bg-[#2C4A2E] relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `url(${APP_BG}) center/cover no-repeat` }}
        />
        <div className="absolute inset-0 bg-[#2C4A2E]/80" />

        <div className="container relative z-10">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-4 reveal">
                <div className="w-8 h-px bg-[#C8922A]" />
                <span className="section-label" style={{ color: "#C8922A" }}>Why It's Different</span>
                <div className="w-8 h-px bg-[#C8922A]" />
              </div>
              <h2
                className="text-[#F8F4EE] leading-tight reveal"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                }}
              >
                Progress Over Perfection.<br />
                <span className="italic text-[#C8922A]">Always.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "No Shame, No Judgment",
                  desc: "Debt happens. Life happens. This book meets you exactly where you are — without shame, without lectures, without making you feel worse about your situation.",
                },
                {
                  number: "02",
                  title: "Real Life, Not Theory",
                  desc: "Forget the spreadsheets that assume you have a perfect income and zero emergencies. This framework is built for the messy, unpredictable reality of real life.",
                },
                {
                  number: "03",
                  title: "Small Wins Build Big Change",
                  desc: "Progress isn't linear. Every small step counts. The book and app are designed to help you celebrate momentum — because momentum is what actually changes behavior.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="reveal bg-[#F8F4EE]/8 border border-[#F8F4EE]/15 rounded-2xl p-8 backdrop-blur-sm hover:bg-[#F8F4EE]/12 transition-colors"
                >
                  <div
                    className="text-[#C8922A]/50 font-bold text-5xl mb-4 leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.number}
                  </div>
                  <h3
                    className="text-[#F8F4EE] font-semibold text-xl mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#F8F4EE]/65 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS — 3-Step Journey
          ================================================================ */}
      <section id="how-it-works" className="py-24 bg-[#F8F4EE]">
        <div className="container">
          <RevealSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4 reveal">
                <div className="w-8 h-px bg-[#C8922A]" />
                <span className="section-label">The Journey</span>
                <div className="w-8 h-px bg-[#C8922A]" />
              </div>
              <h2
                className="text-[#1A2E1A] reveal"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                }}
              >
                Three Steps to Real Progress
              </h2>
              <p
                className="text-[#2C4A2E]/65 text-base mt-4 max-w-xl mx-auto reveal"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                No complicated systems. No overwhelming spreadsheets. Just a clear path forward.
              </p>
            </div>

            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-14 left-[16.67%] right-[16.67%] h-px bg-[#C8922A]/25" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    step: "1",
                    title: "Get the Book",
                    desc: "Read Make Real Progress and follow the framework to understand your debt, your habits, and your path forward. No financial degree required.",
                    cta: "Buy on Amazon",
                    href: "https://amzn.to/3OVorkI",
                  },
                  {
                    step: "2",
                    title: "Download the App",
                    desc: "Create your free account and connect the companion app to your book journey. Set up your debt tracker and start logging your first wins.",
                    cta: "Get the App",
                    href: "https://app.makerealprogressapp.com",
                  },
                  {
                    step: "3",
                    title: "Make Real Progress",
                    desc: "Follow the plan, track your milestones, and watch your debt shrink. Celebrate every win — because every win matters on this journey.",
                    cta: "Start Today",
                    href: "https://app.makerealprogressapp.com/register",
                  },
                ].map((item) => (
                  <div key={item.step} className="reveal flex flex-col items-center text-center">
                    {/* Step circle */}
                    <div
                      className="w-14 h-14 rounded-full bg-[#2C4A2E] text-[#F8F4EE] flex items-center justify-center font-bold text-xl mb-6 relative z-10"
                      style={{ fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 20px oklch(0.31 0.072 145 / 0.3)" }}
                    >
                      {item.step}
                    </div>
                    <h3
                      className="text-[#1A2E1A] font-semibold text-xl mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[#2C4A2E]/65 text-sm leading-relaxed mb-5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.desc}
                    </p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8922A] font-semibold text-sm hover:text-[#2C4A2E] transition-colors flex items-center gap-1.5"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.cta} <ArrowRight size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          APP FEATURES SECTION
          ================================================================ */}
      <section id="app" className="py-24 bg-[#EDE8DF]">
        <div className="container">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div>
                <div className="flex items-center gap-2 mb-4 reveal">
                  <div className="w-8 h-px bg-[#C8922A]" />
                  <span className="section-label">The Companion App</span>
                </div>
                <h2
                  className="text-[#1A2E1A] leading-tight mb-6 reveal"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 700,
                  }}
                >
                  Your Progress,<br />
                  <span className="italic text-[#C8922A]">In Your Pocket</span>
                </h2>
                <p
                  className="text-[#2C4A2E]/75 text-base leading-relaxed mb-8 reveal"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  The Make Real Progress app is built to complement every chapter of the book.
                  Track your debt payoff, log your wins, and stay motivated — all in one place.
                  And it's completely free.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Debt tracker built around the book's framework",
                    "Milestone celebrations to keep you motivated",
                    "Progress dashboard — see how far you've come",
                    "Secure, private, and completely free to use",
                    "Works alongside every chapter of the book",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3 reveal">
                      <CheckCircle2 size={18} className="text-[#C8922A] flex-shrink-0 mt-0.5" />
                      <span
                        className="text-[#2C4A2E]/80 text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 reveal">
                  <a
                    href="https://app.makerealprogressapp.com/register"
                    className="btn-forest-solid"
                  >
                    Create Free Account
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href="https://app.makerealprogressapp.com"
                    className="btn-forest"
                  >
                    Sign In
                  </a>
                </div>
              </div>

              {/* Right: App visual */}
              <div className="reveal flex justify-center">
                <div
                  className="relative rounded-3xl overflow-hidden w-full max-w-md"
                  style={{
                    background: `url(${APP_BG}) center/cover no-repeat`,
                    minHeight: "420px",
                    boxShadow: "0 32px 80px oklch(0.22 0.05 145 / 0.3)",
                  }}
                >
                  <div className="absolute inset-0 bg-[#2C4A2E]/50" />
                  <div className="relative z-10 p-10 flex flex-col justify-end h-full" style={{ minHeight: "420px" }}>
                    <div className="bg-[#F8F4EE]/10 backdrop-blur-sm border border-[#F8F4EE]/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#C8922A] flex items-center justify-center">
                          <Smartphone size={18} className="text-[#F8F4EE]" />
                        </div>
                        <div>
                          <div
                            className="text-[#F8F4EE] font-semibold text-sm"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Make Real Progress App
                          </div>
                          <div
                            className="text-[#C8922A] text-xs"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Free to use
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {["Debt Tracker", "Progress Dashboard", "Milestone Celebrations"].map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C8922A]" />
                            <span
                              className="text-[#F8F4EE]/80 text-xs"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p
                        className="text-[#F8F4EE]/50 text-xs mt-3 italic"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        App screenshots coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          ABOUT THE AUTHOR — Wanda Gaines
          ================================================================ */}
      <section id="author" className="py-24 bg-[#F8F4EE]">
        <div className="container">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Author image */}
              <div className="lg:col-span-4 flex justify-center reveal">
                <div className="relative flex flex-col items-center">
                  <img
                  src={AUTHOR_FRAME}
                  alt="Wanda Gaines — Author of Make Real Progress"
                  className="w-72 h-72 rounded-full object-cover object-center mx-auto"
                  style={{ objectPosition: "center 15%", boxShadow: "0 20px 60px rgba(44,74,46,0.2)", background: "#F0E8DC" }}
                  />
                  <div
                    className="absolute -bottom-4 -right-4 bg-[#C8922A] text-[#F8F4EE] rounded-full px-4 py-2 text-xs font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Author
                  </div>
                </div>

              </div>

              {/* Author content */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-4 reveal">
                  <div className="w-8 h-px bg-[#C8922A]" />
                  <span className="section-label">About the Author</span>
                </div>
                <h2
                  className="text-[#1A2E1A] leading-tight mb-2 reveal"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                    fontWeight: 700,
                  }}
                >
                  Wanda Gaines
                </h2>
                <p
                  className="text-[#C8922A] font-medium mb-6 reveal"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Author of <em>Make Real Progress</em>
                </p>

                <div className="space-y-4 mb-8">
                  <p
                    className="text-[#2C4A2E]/75 text-base leading-relaxed reveal"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Wanda Gaines wrote <em>Make Real Progress</em> because she knows what it's like
                    to feel overwhelmed by debt — and what it takes to actually get out. Her approach
                    is honest, practical, and built for real people navigating real life.
                  </p>
                  <p
                    className="text-[#2C4A2E]/75 text-base leading-relaxed reveal"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    This isn't a book about perfection. It's about progress — the kind that actually
                    sticks. Wanda's framework is designed to meet you where you are, without judgment,
                    and help you take the next step forward.
                  </p>
                </div>

                {/* Pull quote */}
                <div className="border-l-4 border-[#C8922A] pl-6 py-2 reveal">
                  <Quote size={20} className="text-[#C8922A] mb-2" />
                  <p
                    className="text-[#1A2E1A] text-lg italic leading-relaxed"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    "You don't need to be perfect. You just need to start."
                  </p>
                  <p
                    className="text-[#2C4A2E]/60 text-sm mt-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    — Wanda Gaines
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS PLACEHOLDER
          ================================================================ */}
      <section className="py-24 bg-[#EDE8DF]">
        <div className="container">
          <RevealSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4 reveal">
                <div className="w-8 h-px bg-[#C8922A]" />
                <span className="section-label">Reader Reviews</span>
                <div className="w-8 h-px bg-[#C8922A]" />
              </div>
              <h2
                className="text-[#1A2E1A] reveal"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                }}
              >
                Real People. Real Progress.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  stars: 5,
                  quote: "This is the first finance book that didn't make me feel bad about myself. Practical, honest, and actually doable.",
                  name: "Michelle T.",
                  detail: "Verified Purchase",
                },
                {
                  stars: 5,
                  quote: "The companion app is a game-changer. Being able to track my progress alongside the book kept me motivated every single week.",
                  name: "Darnell R.",
                  detail: "Verified Purchase",
                },
                {
                  stars: 5,
                  quote: "I've read a dozen money books. This is the only one I've actually finished — and more importantly, the only one I've actually used.",
                  name: "Sandra K.",
                  detail: "Verified Purchase",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="reveal bg-[#FFFDF9] rounded-2xl p-7"
                  style={{ boxShadow: "0 4px 24px oklch(0.31 0.072 145 / 0.08)" }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={14} className="text-[#C8922A] fill-[#C8922A]" />
                    ))}
                  </div>
                  <p
                    className="text-[#2C4A2E]/80 text-sm leading-relaxed mb-5 italic"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    "{t.quote}"
                  </p>
                  <div>
                    <div
                      className="text-[#1A2E1A] font-semibold text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-[#2C4A2E]/50 text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {t.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          FAQ SECTION
          ================================================================ */}
      <section id="faq" className="py-24 bg-[#F8F4EE]">
        <div className="container">
          <RevealSection>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4 reveal">
                  <div className="w-8 h-px bg-[#C8922A]" />
                  <span className="section-label">Common Questions</span>
                  <div className="w-8 h-px bg-[#C8922A]" />
                </div>
                <h2
                  className="text-[#1A2E1A] reveal"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 700,
                  }}
                >
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="bg-[#FFFDF9] rounded-2xl px-8 py-2 reveal" style={{ boxShadow: "0 4px 24px oklch(0.31 0.072 145 / 0.08)" }}>
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ================================================================
          IS THIS BOOK RIGHT FOR ME? QUIZ
          ================================================================ */}
      <BookQuiz />

      {/* ================================================================
          FINAL CTA BAND
          ================================================================ */}
      <section className="py-24 bg-[#2C4A2E] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{ background: `url(${HERO_BG}) center/cover no-repeat` }}
        />
        <div className="container relative z-10 text-center">
          <RevealSection>
            <div className="max-w-2xl mx-auto">
              <h2
                className="text-[#F8F4EE] leading-tight mb-6 reveal"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 700,
                }}
              >
                Your journey starts<br />
                <span className="italic text-[#C8922A]">with one step.</span>
              </h2>
              <p
                className="text-[#F8F4EE]/70 text-base leading-relaxed mb-10 reveal"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Get the book. Download the app. Start making real progress today —
                no matter where you're starting from.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
                <a href="https://amzn.to/3OVorkI" target="_blank" rel="noopener noreferrer" className="btn-amber pulse-amber text-base">
                  <BookOpen size={18} />
                  Buy the Book on Amazon
                </a>
                <a
                  href="https://app.makerealprogressapp.com/register"
                  className="text-base"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "transparent",
                    border: "2px solid oklch(0.995 0.008 90 / 0.5)",
                    color: "oklch(0.995 0.008 90)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0.875rem 2rem",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    transition: "all 0.25s ease",
                  }}
                >
                  <Smartphone size={18} />
                  Create Free Account
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
