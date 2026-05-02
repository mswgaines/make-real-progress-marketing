/**
 * Admin Blog Panel — Make Real Progress
 * Route: /admin/blog
 * Password-protected panel to create, edit, and manage blog articles.
 * Articles are saved via the /api/blog API endpoint.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  getAllPostsAdmin,
  loadAdminPosts,
  getPostBySlugAdmin,
  generateSlug,
  estimateReadTime,
  formatDate,
  savePost,
  deletePost,
  BlogPost,
} from "@/lib/blog";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

// Admin password — simple client-side protection
const ADMIN_PASSWORD = "mrp-admin-2026";

type View = "list" | "create" | "edit";

interface FormState {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  published: boolean;
  author: string;
  tags: string; // comma-separated
  readTime: string;
}

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  category: "",
  excerpt: "",
  content: "",
  publishedAt: new Date().toISOString().split("T")[0],
  published: false,
  author: "Wanda Gaines",
  tags: "",
  readTime: "",
};

const CATEGORIES = [
  "Debt Payoff Strategies",
  "Budgeting",
  "Tools & Resources",
  "Mindset & Motivation",
  "Financial Planning",
  "Book Insights",
];

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        published
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {published ? (
        <>
          <Eye size={10} /> Published
        </>
      ) : (
        <>
          <EyeOff size={10} /> Draft
        </>
      )}
    </span>
  );
}

export default function AdminBlog() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [view, setView] = useState<View>("list");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // Check session storage for auth
    const stored = sessionStorage.getItem("mrp-admin-auth");
    if (stored === "true") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) {
      // Load from Supabase on mount
      loadAdminPosts().then((loaded) => setPosts(loaded));
    }
  }, [authed]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("mrp-admin-auth", "true");
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("mrp-admin-auth");
    setAuthed(false);
  }

  function startCreate() {
    setForm({ ...EMPTY_FORM, publishedAt: new Date().toISOString().split("T")[0] });
    setEditingSlug(null);
    setSaveResult(null);
    setView("create");
  }

  function startEdit(slug: string) {
    const post = getPostBySlugAdmin(slug);
    if (!post) return;
    setForm({
      slug: post.slug,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.publishDate || post.publishedAt || new Date().toISOString().split('T')[0],
      published: post.published,
      author: post.author,
      tags: post.tags.join(", "),
      readTime: post.readTime,
    });
    setEditingSlug(slug);
    setSaveResult(null);
    setView("edit");
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      // Auto-generate slug only when creating new
      ...(editingSlug === null ? { slug: generateSlug(title) } : {}),
    }));
  }

  function handleContentChange(content: string) {
    setForm((prev) => ({
      ...prev,
      content,
      readTime: estimateReadTime(content),
    }));
  }

  async function handleSave() {
    if (!form.title || !form.slug || !form.content || !form.category) {
      setSaveResult({ type: "error", message: "Title, slug, category, and content are required." });
      return;
    }

    setSaving(true);
    setSaveResult(null);

    const post: BlogPost = {
      slug: form.slug,
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      content: form.content,
      publishedAt: form.publishedAt,
      published: form.published,
      author: form.author,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      readTime: form.readTime || estimateReadTime(form.content),
    };

    try {
      const response = await fetch("/api/blog/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post, adminPassword: ADMIN_PASSWORD }),
      });

      if (response.ok) {
        savePost(post);
        setSaveResult({ type: "success", message: `Article "${post.title}" saved successfully!` });
        // Refresh from Supabase
        loadAdminPosts().then((loaded) => setPosts(loaded));
        setTimeout(() => {
          setView("list");
          loadAdminPosts().then((loaded) => setPosts(loaded));
        }, 1500);
      } else {
        const err = await response.json().catch(() => ({}));
        setSaveResult({ type: "error", message: err.error || "Failed to save. Please try again." });
      }
    } catch {
      // Fallback: save in memory only (for dev/preview)
      savePost(post);
      setSaveResult({ type: "success", message: `Article saved (in-memory). Deploy to persist.` });
      loadAdminPosts().then((loaded) => setPosts(loaded));
      setTimeout(() => {
        setView("list");
        loadAdminPosts().then((loaded) => setPosts(loaded));
      }, 1500);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    try {
      await fetch("/api/blog/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, adminPassword: ADMIN_PASSWORD }),
      });
    } catch {
      deletePost(slug);
    }
    // Refresh from Supabase after delete
    loadAdminPosts().then((loaded) => setPosts(loaded));
    setDeleteConfirm(null);
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold text-[#1A2E1A] mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Blog Admin
            </h1>
            <p className="text-[#2C4A2E]/60 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Make Real Progress
            </p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-8 shadow-sm">
            <label className="block text-sm font-semibold text-[#1A2E1A] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Admin Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors mb-4 bg-white ${
                passwordError
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#2C4A2E]/20 focus:border-[#2C4A2E]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              placeholder="Enter password"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-500 text-xs mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full btn-amber py-3 text-sm font-semibold"
            >
              Sign In
            </button>
          </form>
          <div className="text-center mt-4">
            <Link href="/">
              <span className="text-xs text-[#2C4A2E]/50 hover:text-[#2C4A2E] cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                ← Back to website
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Article form (create / edit) ──────────────────────────────────────────
  if (view === "create" || view === "edit") {
    return (
      <div className="min-h-screen bg-[#F8F4EE]">
        {/* Admin header */}
        <header className="bg-[#FFFDF9] border-b border-[#2C4A2E]/10 px-4 py-4 sticky top-0 z-50">
          <div className="container max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-sm text-[#2C4A2E]/70 hover:text-[#2C4A2E] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <ArrowLeft size={16} />
              Back to articles
            </button>
            <h1
              className="text-base font-bold text-[#1A2E1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {view === "create" ? "New Article" : "Edit Article"}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  form.published
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                {form.published ? <Eye size={12} /> : <EyeOff size={12} />}
                {form.published ? "Published" : "Draft"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 btn-amber px-4 py-2 text-xs font-semibold disabled:opacity-60"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Save
              </button>
            </div>
          </div>
        </header>

        <div className="container max-w-5xl mx-auto px-4 py-8">
          {saveResult && (
            <div
              className={`flex items-center gap-2 p-4 rounded-xl mb-6 text-sm ${
                saveResult.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {saveResult.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {saveResult.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-6">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#2C4A2E]/60 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-xl font-bold text-[#1A2E1A] bg-transparent border-0 outline-none placeholder-[#2C4A2E]/30 resize-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  placeholder="Enter article title..."
                />
              </div>

              {/* Excerpt */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-6">
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#2C4A2E]/60 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Excerpt / Summary *
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full text-sm text-[#2C4A2E]/80 bg-transparent border-0 outline-none placeholder-[#2C4A2E]/30 resize-none leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  placeholder="A brief 1-2 sentence summary shown on the blog listing page..."
                />
              </div>

              {/* Content */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#2C4A2E]/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Article Content * (Markdown supported)
                  </label>
                  {form.readTime && (
                    <span className="text-xs text-[#2C4A2E]/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      ~{form.readTime}
                    </span>
                  )}
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={28}
                  className="w-full text-sm text-[#2C4A2E]/80 bg-transparent border-0 outline-none placeholder-[#2C4A2E]/30 resize-y leading-relaxed font-mono"
                  placeholder="Write your article in Markdown...

## Section Heading

Your paragraph text here...

### Sub-heading

More content..."
                />
                <p className="text-xs text-[#2C4A2E]/40 mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Supports Markdown: **bold**, *italic*, ## headings, - lists, &gt; blockquotes
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Publish settings */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2C4A2E]/60 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Publish Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2C4A2E]/70 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Status
                    </label>
                    <button
                      onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.published
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-yellow-300 bg-yellow-50 text-yellow-700"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="flex items-center gap-1.5">
                        {form.published ? <Eye size={13} /> : <EyeOff size={13} />}
                        {form.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs opacity-60">Click to toggle</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2C4A2E]/70 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={form.publishedAt}
                      onChange={(e) => setForm((p) => ({ ...p, publishedAt: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#2C4A2E]/20 text-sm text-[#1A2E1A] bg-white outline-none focus:border-[#2C4A2E]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2C4A2E]/70 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Author
                    </label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#2C4A2E]/20 text-sm text-[#1A2E1A] bg-white outline-none focus:border-[#2C4A2E]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Category & Tags */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2C4A2E]/60 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Category & Tags
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2C4A2E]/70 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#2C4A2E]/20 text-sm text-[#1A2E1A] bg-white outline-none focus:border-[#2C4A2E]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <option value="">Select a category...</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2C4A2E]/70 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#2C4A2E]/20 text-sm text-[#1A2E1A] bg-white outline-none focus:border-[#2C4A2E]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      placeholder="debt payoff, budgeting, tips"
                    />
                  </div>
                </div>
              </div>

              {/* URL Slug */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#2C4A2E]/60 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  URL Slug
                </h3>
                <div>
                  <label className="block text-xs font-medium text-[#2C4A2E]/70 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    /blog/
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#2C4A2E]/20 text-sm text-[#1A2E1A] bg-white outline-none focus:border-[#2C4A2E] font-mono"
                    style={{ fontFamily: "monospace" }}
                    placeholder="article-url-slug"
                  />
                  {form.slug && (
                    <p className="text-xs text-[#2C4A2E]/40 mt-1.5 font-mono">
                      makerealprogressapp.com/blog/{form.slug}
                    </p>
                  )}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full btn-amber py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Saving..." : "Save Article"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Article list ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* Admin header */}
      <header className="bg-[#FFFDF9] border-b border-[#2C4A2E]/10 px-4 py-4 sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="flex items-center gap-1.5 text-sm text-[#2C4A2E]/60 hover:text-[#2C4A2E] transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <ArrowLeft size={14} /> Website
              </span>
            </Link>
            <span className="text-[#2C4A2E]/20">/</span>
            <h1
              className="text-base font-bold text-[#1A2E1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Blog Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog">
              <span className="flex items-center gap-1.5 text-xs text-[#2C4A2E]/60 hover:text-[#2C4A2E] transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <ExternalLink size={12} /> View Blog
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-[#2C4A2E]/50 hover:text-[#2C4A2E] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign Out
            </button>
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 btn-amber px-4 py-2 text-xs font-semibold"
            >
              <Plus size={13} /> New Article
            </button>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Articles", value: posts.length },
            { label: "Published", value: posts.filter((p) => p.published).length },
            { label: "Drafts", value: posts.filter((p) => !p.published).length },
            { label: "Categories", value: new Set(posts.map((p) => p.category)).size },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#FFFDF9] rounded-xl border border-[#2C4A2E]/10 p-5 text-center">
              <div
                className="text-3xl font-bold text-[#1A2E1A] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs text-[#2C4A2E]/50 font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Articles table */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#2C4A2E]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2C4A2E]/10 flex items-center justify-between">
            <h2
              className="font-bold text-[#1A2E1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              All Articles
            </h2>
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#C8922A] hover:text-[#a87420] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Plus size={13} /> New Article
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[#2C4A2E]/40 text-sm mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No articles yet.
              </p>
              <button onClick={startCreate} className="btn-amber px-6 py-2.5 text-sm font-semibold">
                Create your first article
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#2C4A2E]/8">
              {posts.map((post) => (
                <div key={post.slug} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-[#F8F4EE]/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge published={post.published} />
                      <span className="text-xs text-[#C8922A] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {post.category}
                      </span>
                    </div>
                    <h3
                      className="font-semibold text-[#1A2E1A] text-sm leading-snug mb-1 truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#2C4A2E]/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                      <span>·</span>
                      <span className="font-mono">/blog/{post.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {post.published && (
                      <Link href={`/blog/${post.slug}`}>
                        <span
                          className="p-2 rounded-lg text-[#2C4A2E]/40 hover:text-[#2C4A2E] hover:bg-[#2C4A2E]/8 transition-colors cursor-pointer"
                          title="View article"
                        >
                          <ExternalLink size={14} />
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={() => startEdit(post.slug)}
                      className="p-2 rounded-lg text-[#2C4A2E]/40 hover:text-[#2C4A2E] hover:bg-[#2C4A2E]/8 transition-colors"
                      title="Edit article"
                    >
                      <Edit2 size={14} />
                    </button>
                    {deleteConfirm === post.slug ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-xs font-semibold"
                          title="Confirm delete"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-2 rounded-lg text-[#2C4A2E]/40 hover:bg-[#2C4A2E]/8 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.slug)}
                        className="p-2 rounded-lg text-[#2C4A2E]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete article"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
