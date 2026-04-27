/**
 * About Page — Make Real Progress
 * Dedicated author page for Wanda Gaines
 */

import { Quote, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AUTHOR_FRAME = "/wanda-headshot.png";

function RevealSection({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />

      {/* Hero band */}
      <section className="pt-32 pb-16 bg-[#2C4A2E]">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px bg-[#C8922A]" />
            <span
              className="text-[#C8922A] text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              About the Author
            </span>
            <div className="w-8 h-px bg-[#C8922A]" />
          </div>
          <h1
            className="text-[#F8F4EE] leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
            }}
          >
            Wanda Gaines
          </h1>
          <p
            className="text-[#C8922A] font-medium mt-3 text-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Author of <em>Make Real Progress</em>
          </p>
        </div>
      </section>

      {/* Main author section */}
      <section id="author" className="py-24 bg-[#F8F4EE]">
        <div className="container">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Author image */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative flex flex-col items-center">
                  <img
                    src={AUTHOR_FRAME}
                    alt="Wanda Gaines — Author of Make Real Progress"
                    className="w-72 object-cover mx-auto"
                    style={{
                      borderRadius: "1.5rem",
                      boxShadow: "0 20px 60px rgba(44,74,46,0.25)",
                      display: "block",
                    }}
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
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-px bg-[#C8922A]" />
                  <span
                    className="text-[#C8922A] text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    About the Author
                  </span>
                </div>
                <h2
                  className="text-[#1A2E1A] leading-tight mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                    fontWeight: 700,
                  }}
                >
                  Wanda Gaines
                </h2>
                <p
                  className="text-[#C8922A] font-medium mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Author of <em>Make Real Progress</em>
                </p>
                <div className="space-y-4 mb-8">
                  <p
                    className="text-[#2C4A2E]/75 text-base leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Wanda Gaines wrote <em>Make Real Progress</em> because she knows what it's like
                    to feel overwhelmed by debt — and what it takes to actually get out. Her approach
                    is honest, practical, and built for real people navigating real life.
                  </p>
                  <p
                    className="text-[#2C4A2E]/75 text-base leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    This isn't a book about perfection. It's about progress — the kind that actually
                    sticks. Wanda's framework is designed to meet you where you are, without judgment,
                    and help you take the next step forward.
                  </p>
                  <p
                    className="text-[#2C4A2E]/75 text-base leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    The companion app was built as a natural extension of the book — a tool that
                    brings the framework to life in your daily routine, so progress doesn't stop
                    when you close the page.
                  </p>
                </div>

                {/* Pull quote */}
                <div className="border-l-4 border-[#C8922A] pl-6 py-2 mb-10">
                  <Quote size={20} className="text-[#C8922A] mb-2" />
                  <p
                    className="text-[#1A2E1A] text-xl italic leading-relaxed"
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

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://amzn.to/3OVorkI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#C8922A",
                      color: "#F8F4EE",
                    }}
                  >
                    Get the Book on Amazon
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href="https://app.makerealprogressapp.com/signup"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      borderColor: "#2C4A2E",
                      color: "#2C4A2E",
                    }}
                  >
                    Try the App Free
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
