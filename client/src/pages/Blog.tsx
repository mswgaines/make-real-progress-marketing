/**
 * Blog Listing Page — Make Real Progress
 * Route: /blog
 * Design: Warm Editorial Premium — "The Journey"
 */

import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllPosts, getCategories, getPostsByCategory, formatDate, BlogPost } from "@/lib/blog";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";

const AMAZON_URL = "https://amzn.to/4cwBPUa";
const APP_URL = "https://app.makerealprogressapp.com/signup";

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className={`group cursor-pointer rounded-2xl overflow-hidden border border-[#2C4A2E]/10 bg-[#FFFDF9] hover:border-[#2C4A2E]/30 hover:shadow-lg transition-all duration-300 ${
          featured ? "md:col-span-2" : ""
        }`}
      >
        {/* Category tag */}
        <div className={`${featured ? "p-8 pb-0" : "p-6 pb-0"}`}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8922A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Tag size={10} />
            {post.category}
          </span>
        </div>

        <div className={`${featured ? "p-8 pt-4" : "p-6 pt-3"}`}>
          <h2
            className={`text-[#1A2E1A] font-bold leading-snug group-hover:text-[#2C4A2E] transition-colors mb-3 ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h2>

          <p
            className="text-[#2C4A2E]/65 leading-relaxed mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: featured ? "1rem" : "0.9rem" }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-[#2C4A2E]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readTime}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#2C4A2E] group-hover:text-[#C8922A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Read more <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const allPosts = getAllPosts();
  const categories = getCategories();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : getPostsByCategory(activeCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest text-[#C8922A] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            The Make Real Progress Blog
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1A2E1A] mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Practical Advice for Your <br className="hidden md:block" />
            Debt-Free Journey
          </h1>
          <p
            className="text-[#2C4A2E]/70 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            No shame. No perfection required. Just honest, actionable guidance
            to help you make real progress — one step at a time.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="pb-8 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#2C4A2E] text-[#F8F4EE]"
                    : "bg-[#FFFDF9] text-[#2C4A2E] border border-[#2C4A2E]/20 hover:border-[#2C4A2E]/50"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#2C4A2E]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No articles in this category yet.
              </p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featuredPost && (
                <div className="mb-6">
                  <BlogCard post={featuredPost} featured />
                </div>
              )}

              {/* Remaining posts grid */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {remainingPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-[#2C4A2E]">
        <div className="container max-w-3xl mx-auto text-center">
          <BookOpen size={32} className="text-[#C8922A] mx-auto mb-4" />
          <h2
            className="text-2xl md:text-3xl font-bold text-[#F8F4EE] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Make Real Progress?
          </h2>
          <p
            className="text-[#F8F4EE]/70 mb-8 text-base leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Get the book on Amazon and track your journey with the free companion app.
            No perfection required — just progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={AMAZON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-amber px-8 py-3 text-sm font-semibold"
            >
              Buy the Book on Amazon
            </a>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-sm font-semibold rounded-xl border border-[#F8F4EE]/30 text-[#F8F4EE] hover:bg-[#F8F4EE]/10 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Try the Free App
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
