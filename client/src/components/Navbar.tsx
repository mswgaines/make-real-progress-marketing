/**
 * Navbar — Make Real Progress
 * Design: Warm Editorial Premium — "The Journey"
 * Transparent on hero, solid parchment on scroll
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  // On non-home pages, always show solid navbar (transparent only works on home hero)
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "The Book", href: "/#book" },
    { label: "The App", href: "/#app" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
  ];

  const KIT_FORM_URL = "https://make-real-progress.kit.com/2721d9624f";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen || !isHome
          ? "bg-[#F8F4EE]/95 backdrop-blur-sm shadow-sm border-b border-[#2C4A2E]/10"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex flex-col leading-none select-none">
              <span
                className="font-bold tracking-tight text-[#2C4A2E]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.25rem",
                  lineHeight: 1.1,
                }}
              >
                Make Real Progress
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#2C4A2E]/80 hover:text-[#2C4A2E] transition-colors duration-200 text-sm font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={KIT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2C4A2E]/80 hover:text-[#2C4A2E] transition-colors duration-200 text-sm font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Free Starter Kit
            </a>
            <a
              href="https://app.makerealprogressapp.com"
              className="text-[#2C4A2E]/80 hover:text-[#2C4A2E] transition-colors duration-200 text-sm font-medium border border-[#2C4A2E]/30 rounded-lg px-4 py-2 hover:border-[#2C4A2E]/60"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign In
            </a>
            <a
              href="https://amzn.to/3OVorkI"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-amber text-sm py-2.5 px-5"
            >
              Buy the Book
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#2C4A2E] hover:bg-[#2C4A2E]/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#F8F4EE] border-t border-[#2C4A2E]/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#2C4A2E] font-medium py-1 border-b border-[#2C4A2E]/10 last:border-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={KIT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2C4A2E] font-medium py-2 text-center border border-[#2C4A2E]/30 rounded-lg bg-[#2C4A2E]/5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => setMobileOpen(false)}
          >
            Free Starter Kit
          </a>
          <a
            href="https://app.makerealprogressapp.com"
            className="text-[#2C4A2E] font-medium py-2 text-center border border-[#2C4A2E]/30 rounded-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </a>
          <a
            href="https://amzn.to/3OVorkI"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-amber text-sm mt-2 text-center"
            onClick={() => setMobileOpen(false)}
          >
            Buy the Book
          </a>
        </div>
      </div>
    </header>
  );
}
