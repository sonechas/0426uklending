import React, { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import LoanImage from "../assets/loan-img.webp";
import { blogPosts, categories } from "../data/blogData";
import "../css/Blog.css";

const SearchIcon = () => (
  <svg className="blog-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = blogPosts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* JSON-LD structured data for the blog listing page */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "UK Lending Mortgage & Finance Blog",
        "description": "Expert guides on mortgages, bridging loans, buy-to-let, and property finance from UK Lending's FCA-regulated advisors.",
        "url": "https://uklending.co.uk/blog",
        "publisher": {
          "@type": "Organization",
          "name": "UK Lending",
          "url": "https://uklending.co.uk"
        }
      })}} />

      <Hero
        title="UK Lending Blog"
        subHeading="Expert Insights on Mortgages, Bridging Finance & Property"
        detail="In-depth guides, market analysis, and practical advice from our FCA-regulated advisors — helping you make informed property finance decisions."
        className="hero-2"
        imageUrl={LoanImage}
      />

      <div className="blog-wrapper">
        <div className="blog-header">
          <span className="blog-label">Knowledge Hub</span>
          <h1 className="blog-title">Mortgage & Finance Guides</h1>
          <p className="blog-subtitle">
            Practical, expert-led articles to help you navigate mortgages, bridging loans, buy-to-let, and property finance with confidence.
          </p>
        </div>

        {/* Search + Category Filter */}
        <div className="blog-controls">
          <div className="blog-search-wrap">
            <SearchIcon />
            <input
              type="search"
              className="blog-search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog articles"
              id="blog-search"
            />
          </div>
          <div className="blog-categories" role="list" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                role="listitem"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filtered.length === 0 ? (
            <div className="blog-empty">
              <p>No articles found for "<strong>{searchQuery}</strong>". Try a different search term.</p>
            </div>
          ) : (
            filtered.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="blog-card"
                aria-label={`Read: ${post.title}`}
              >
                <div className="blog-card-top">
                  <span className="blog-card-category">{post.category}</span>
                  <h2 className="blog-card-title">{post.title}</h2>
                </div>
                <div className="blog-card-body">
                  <p className="blog-card-summary">{post.summary}</p>
                  <div className="blog-card-footer">
                    <span className="blog-card-meta">{post.date} · {post.readTime}</span>
                    <span className="blog-read-more">Read article →</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}