import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogPost, getRelatedPosts } from "../data/blogData";
import "../css/Blog.css";

// Inline SVG icons
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getBlogPost(slug);
  const related = getRelatedPosts(slug, 3);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // 404 redirect if slug not found
  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "#091b33", marginBottom: "1rem" }}>Article Not Found</h1>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>This article doesn't exist or may have moved.</p>
        <Link to="/blog" style={{ color: "#005ec4", fontWeight: 700, textDecoration: "none" }}>
          ← Back to blog
        </Link>
      </div>
    );
  }

  // JSON-LD structured data for the article (Article + BreadcrumbList + FAQPage)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "UK Lending",
      "url": "https://uklending.co.uk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "UK Lending",
      "url": "https://uklending.co.uk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://uklending.co.uk/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://uklending.co.uk/blog/${post.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://uklending.co.uk" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://uklending.co.uk/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://uklending.co.uk/blog/${post.slug}` }
    ]
  };

  return (
    <>
      {/* SEO meta via dangerouslySetInnerHTML on a hidden span (React doesn't allow Helmet without library) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="blog-post-page">
        {/* Breadcrumb */}
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="blog-breadcrumb-sep">›</span>
          <Link to="/blog">Blog</Link>
          <span className="blog-breadcrumb-sep">›</span>
          <span>{post.category}</span>
        </nav>

        {/* Category pill */}
        <span className="blog-post-category">{post.category}</span>

        {/* Title */}
        <h1 className="blog-post-title">{post.title}</h1>

        {/* Meta row */}
        <div className="blog-post-meta-row">
          <span className="blog-post-meta-item">
            <CalendarIcon />
            {post.date}
          </span>
          <span className="blog-post-meta-item">
            <ClockIcon />
            {post.readTime}
          </span>
          <span className="blog-post-meta-item">
            <TagIcon />
            {post.category}
          </span>
        </div>

        {/* Article body */}
        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* CTA Banner */}
        <div className="blog-post-cta">
          <h3>Ready to Take the Next Step?</h3>
          <p>
            Speak to an FCA-regulated UK Lending advisor today — expert mortgage advice, completely free of broker fees.
          </p>
          <Link to="/configure" className="blog-post-cta-btn">
            Request a Free Callback →
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="blog-related" aria-label="Related articles">
            <h2 className="blog-related-title">Related Articles</h2>
            <div className="blog-related-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-related-card">
                  <div className="blog-related-cat">{r.category}</div>
                  <div className="blog-related-name">{r.title}</div>
                  <div className="blog-related-date">{r.date} · {r.readTime}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link
            to="/blog"
            style={{ color: "#005ec4", fontWeight: 700, textDecoration: "none", fontSize: "0.95rem" }}
          >
            ← Back to all articles
          </Link>
        </div>
      </article>
    </>
  );
}
