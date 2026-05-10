"use client";

import React, { useState, useEffect } from "react";

interface ArticleListClientProps {
  categories: string[];
  langPrefix: string;
  catLabelMap: Record<string, string>;
  noArticlesText: string;
  viewsText: string;
  helpfulText: string;
  children: React.ReactNode;
}

export default function ArticleListClient({
  categories,
  langPrefix,
  catLabelMap,
  noArticlesText,
  viewsText,
  helpfulText,
  children,
}: ArticleListClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync sidebar category button clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-category]");
      if (target) {
        const cat = target.getAttribute("data-category");
        if (cat) {
          setActiveCategory(cat);
          setCurrentPage(1);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Toggle visibility of pre-rendered article pages + sidebar active state
  useEffect(() => {
    // Show/hide article pages
    const pages = document.querySelectorAll(".article-page");
    pages.forEach((page) => {
      const pageCat = page.getAttribute("data-cat");
      const pageNum = page.getAttribute("data-page");
      if (pageCat === activeCategory && pageNum === String(currentPage)) {
        page.classList.remove("hidden");
      } else {
        page.classList.add("hidden");
      }
    });

    // Update sidebar active state
    const buttons = document.querySelectorAll("[data-category]");
    buttons.forEach((btn) => {
      const cat = btn.getAttribute("data-category");
      if (cat === activeCategory) {
        btn.classList.add("bg-[#1b887a]", "text-white", "shadow-md");
        btn.classList.remove("hover:bg-gray-50", "text-gray-700");
        const badge = btn.querySelector(".rounded-full");
        if (badge) {
          badge.classList.add("bg-white/20");
          badge.classList.remove("bg-gray-100", "text-gray-500");
        }
      } else {
        btn.classList.remove("bg-[#1b887a]", "text-white", "shadow-md");
        btn.classList.add("hover:bg-gray-50", "text-gray-700");
        const badge = btn.querySelector(".rounded-full");
        if (badge) {
          badge.classList.remove("bg-white/20");
          badge.classList.add("bg-gray-100", "text-gray-500");
        }
      }
    });
  }, [activeCategory, currentPage]);

  // Calculate total pages for active category
  const totalPages = (() => {
    const pages = document.querySelectorAll(
      `.article-page[data-cat="${activeCategory}"]`
    );
    return pages.length || 1;
  })();

  // Initial show on mount
  useEffect(() => {
    const pages = document.querySelectorAll(
      `.article-page[data-cat="All"][data-page="1"]`
    );
    pages.forEach((p) => p.classList.remove("hidden"));

    // Set initial active sidebar state
    const allBtn = document.querySelector('[data-category="All"]');
    if (allBtn) {
      allBtn.classList.add("bg-[#1b887a]", "text-white", "shadow-md");
      allBtn.classList.remove("hover:bg-gray-50", "text-gray-700");
      const badge = allBtn.querySelector(".rounded-full");
      if (badge) {
        badge.classList.add("bg-white/20");
        badge.classList.remove("bg-gray-100", "text-gray-500");
      }
    }
  }, []);

  // Count pages by looking at pre-rendered divs
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat] = document.querySelectorAll(
        `.article-page[data-cat="${cat}"]`
      ).length;
    });
    setPageCounts(counts);
  }, [categories]);

  const activeTotalPages = pageCounts[activeCategory] || 1;

  return (
    <div className="flex-1">
      {/* Pre-rendered article pages (children) */}
      {children}

      {/* Pagination */}
      {activeTotalPages > 1 && (
        <div className="pt-10 flex justify-center gap-2">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-lg bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {Array.from({ length: activeTotalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                  p === currentPage
                    ? "bg-[#1b887a] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => {
              if (currentPage < activeTotalPages) {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo({ top: 300, behavior: "smooth" });
              }
            }}
            disabled={currentPage === activeTotalPages}
            className="w-10 h-10 rounded-lg bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
