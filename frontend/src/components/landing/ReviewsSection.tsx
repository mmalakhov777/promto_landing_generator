"use client";

import { useState } from "react";
import Image from "next/image";
import type { ReviewItem } from "@/types/public";

interface ReviewsSectionProps {
  title: string;
  reviews: ReviewItem[];
}

export function ReviewsSection({ title, reviews }: ReviewsSectionProps) {
  const [active, setActive] = useState(0);

  if (!reviews.length) return null;

  const visibleCount = Math.min(reviews.length, 3);
  const pages = Math.ceil(reviews.length / visibleCount);

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews
            .slice(active * visibleCount, (active + 1) * visibleCount)
            .map((review, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-[20px] bg-surface p-6 shadow-card"
              >
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < review.rating ? "text-warning" : "text-text-light"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-text-muted">
                  {review.text}
                </p>
                <div className="mt-4 flex items-center gap-3 pt-4">
                  {review.avatar_url ? (
                    <Image
                      src={review.avatar_url}
                      alt={review.author}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white" style={{
                      background: 'linear-gradient(196deg, #5EFF6E 0%, #464EFF 71%)'
                    }}>
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-text">{review.author}</span>
                </div>
              </div>
            ))}
        </div>
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === active ? "bg-primary" : "bg-border-light hover:bg-text-muted"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
