/**
 * Footer — Make Real Progress
 * Design: Warm Editorial Premium — "The Journey"
 * Deep forest green background, warm cream text
 */

import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A2E1A] text-[#F8F4EE]">
      {/* Main footer content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3
                className="text-[#F8F4EE] font-bold text-xl mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Make Real Progress
              </h3>
              <p
                className="text-[#C8922A] text-xs font-medium tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                by Wanda Gaines
              </p>
            </div>
            <p
              className="text-[#F8F4EE]/65 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              A practical guide to getting out of debt and staying out. No shame,
              no perfection required. Start where you are.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="text-[#F8F4EE]/50 hover:text-[#C8922A] transition-colors"
                aria-label="Instagram (coming soon)"
                title="Instagram — coming soon"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-[#F8F4EE]/50 hover:text-[#C8922A] transition-colors"
                aria-label="Twitter (coming soon)"
                title="Twitter — coming soon"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-[#F8F4EE]/50 hover:text-[#C8922A] transition-colors"
                aria-label="Facebook (coming soon)"
                title="Facebook — coming soon"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:hello@makerealprogressapp.com"
                className="text-[#F8F4EE]/50 hover:text-[#C8922A] transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="text-[#F8F4EE] font-semibold text-sm mb-4 tracking-wide uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "The Book", href: "/#book" },
                { label: "The App", href: "/#app" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "About Wanda", href: "/about" },
                { label: "FAQ", href: "/#faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#F8F4EE]/60 hover:text-[#C8922A] text-sm transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get the book */}
          <div>
            <h4
              className="text-[#F8F4EE] font-semibold text-sm mb-4 tracking-wide uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em" }}
            >
              Get the Book
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Paperback on Amazon", href: "https://amzn.to/3OVorkI" },
                { label: "Kindle eBook on Amazon", href: "https://amzn.to/4cIm4cT" },
                { label: "Companion App", href: "/#app" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-[#F8F4EE]/60 hover:text-[#C8922A] text-sm transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a href="https://amzn.to/3OVorkI" target="_blank" rel="noopener noreferrer" className="btn-amber text-sm py-2.5 px-5 pulse-amber">
                Buy on Amazon
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F8F4EE]/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-[#F8F4EE]/40 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © {currentYear} Make Real Progress. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Use", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#F8F4EE]/40 hover:text-[#F8F4EE]/70 text-xs transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
