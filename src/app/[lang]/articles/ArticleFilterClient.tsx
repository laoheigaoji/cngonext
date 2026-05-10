"use client";

import React, { useState, useEffect } from "react";

interface ArticleFilterClientProps {
  categories: string[];
  children: React.ReactNode;
}

// Minimal client component: only handles category toggle visibility + sidebar active state
export default function ArticleFilterClient({ categories, children }: ArticleFilterClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Listen for sidebar category clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-category]");
      if (target) {
        const cat = target.getAttribute("data-category");
        if (cat) setActiveCategory(cat);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Toggle article group visibility + sidebar active style
  useEffect(() => {
    document.querySelectorAll(".article-group").forEach((el) => {
      el.classList.toggle("hidden", el.getAttribute("data-cat") !== activeCategory);
    });

    document.querySelectorAll("[data-category]").forEach((btn) => {
      const cat = btn.getAttribute("data-category");
      const isActive = cat === activeCategory;
      btn.classList.toggle("bg-[#1b887a]", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("shadow-md", isActive);
      btn.classList.toggle("hover:bg-gray-50", !isActive);
      btn.classList.toggle("text-gray-700", !isActive);
      const badge = btn.querySelector(".rounded-full");
      if (badge) {
        badge.classList.toggle("bg-white/20", isActive);
        badge.classList.toggle("bg-gray-100", !isActive);
        badge.classList.toggle("text-gray-500", !isActive);
      }
    });
  }, [activeCategory]);

  // Show "All" on initial mount
  useEffect(() => {
    document.querySelectorAll('.article-group[data-cat="All"]').forEach((el) => {
      el.classList.remove("hidden");
    });
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

  return <div className="flex-1">{children}</div>;
}
