/**
 * Blog Post Page — Make Real Progress
 * Route: /blog/:slug
 * Design: Warm Editorial Premium — "The Journey"
 */

import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadPosts, getPostBySlug, getAllPosts, formatDate, BlogPost } from "@/lib/blog";
import { ArrowLeft, Clock, Tag, BookOpen, ArrowRight } from "lucide-react";

const AMAZON_URL = "https://amzn.to/4cwBPUa";
const APP_URL = "https://app.makerealprogressapp.com/signup";

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group cursor-pointer p-5 rounded-xl border border-[#2C4A2E]/10 bg-[#FFFDF9] hover:border-[#2C4A2E]/30 hover:shadow-md transition-all duration-300">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8922A] mb-2 block" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {post.category}
        </span>
        <h3
          className="text-[#1A2E1A] font-bold text-base leading-snug group-hover:text-[#2C4A2E] transition-colors mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {post.title}
        </h3>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#2C4A2E] group-hover:text-[#C8922A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </article>
    </Link>
  );
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | undefined>(getPostBySlug(params.slug));
  const [allPosts, setAllPosts] = useState<BlogPost[]>(getAllPosts());
  const [loading, setLoading] = useState(!post);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPosts().then((loaded) => {
      setAllPosts(loaded);
      const found = getPostBySlug(params.slug);
      if (found) {
        setPost(found);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EE]">
        <Navbar />
        <div className="container max-w-3xl mx-auto pt-40 pb-20 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-[#2C4A2E]/10 rounded w-24" />
            <div className="h-10 bg-[#2C4A2E]/10 rounded w-full" />
            <div className="h-10 bg-[#2C4A2E]/10 rounded w-3/4" />
            <div className="h-4 bg-[#2C4A2E]/10 rounded w-48 mt-4" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#F8F4EE]">
        <Navbar />
        <div className="container max-w-3xl mx-auto pt-40 pb-20 px-4 text-center">
          <h1
            className="text-3xl font-bold text-[#1A2E1A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Article Not Found
          </h1>
          <p className="text-[#2C4A2E]/60 mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            This article doesn't exist or may have been removed.
          </p>
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-[#2C4A2E] font-semibold hover:text-[#C8922A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <ArrowLeft size={16} /> Back to Blog
            </span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayDate = post.publishDate || post.publishedAt || "";
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const otherPosts = relatedPosts.length < 3
    ? [...relatedPosts, ...allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - relatedPosts.length)]
    : relatedPosts;

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />

      {/* Article header */}
      <section className="pt-28 pb-8 px-4">
        <div className="container max-w-3xl mx-auto">
          {/* Back link */}
          <Link href="/blog">
            <span className="inline-flex items-center gap-1.5 text-sm text-[#2C4A2E]/60 hover:text-[#2C4A2E] transition-colors mb-8 cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <ArrowLeft size={14} /> Back to Blog
            </span>
          </Link>

          {/* Category */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8922A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <Tag size={10} />
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A2E1A] leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C4A2E]/55 pb-8 border-b border-[#2C4A2E]/10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="font-medium text-[#2C4A2E]/80">By {post.author}</span>
            <span>·</span>
            <span>{formatDate(displayDate)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="pb-16 px-4">
        <div className="container max-w-3xl mx-auto">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-[#1A2E1A]
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-[#2C4A2E]/80 prose-p:leading-relaxed prose-p:mb-5
              prose-li:text-[#2C4A2E]/80 prose-li:leading-relaxed
              prose-strong:text-[#1A2E1A] prose-strong:font-semibold
              prose-a:text-[#C8922A] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[#C8922A] prose-blockquote:bg-[#F8F4EE] prose-blockquote:rounded-r-lg prose-blockquote:py-1
              prose-hr:border-[#2C4A2E]/10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#2C4A2E]/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#2C4A2E]/8 text-[#2C4A2E]/70 border border-[#2C4A2E]/10"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* In-article CTA */}
      <section className="py-12 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="rounded-2xl bg-[#2C4A2E] p-8 md:p-10 text-center">
            <BookOpen size={28} className="text-[#C8922A] mx-auto mb-4" />
            <h2
              className="text-xl md:text-2xl font-bold text-[#F8F4EE] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Take the Next Step?
            </h2>
            <p
              className="text-[#F8F4EE]/70 mb-6 text-sm leading-relaxed max-w-lg mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              The <em>Make Real Progress</em> book gives you the complete framework — and the free companion app helps you track every step of your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-amber px-6 py-3 text-sm font-semibold"
              >
                Get the Book on Amazon
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-sm font-semibold rounded-xl border border-[#F8F4EE]/30 text-[#F8F4EE] hover:bg-[#F8F4EE]/10 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Try the Free App
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {otherPosts.length > 0 && (
        <section className="pb-20 px-4">
          <div className="container max-w-3xl mx-auto">
            <h2
              className="text-xl font-bold text-[#1A2E1A] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {otherPosts.map((p) => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
