import { useState } from "react";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@shared/ui/skeleton";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";
import type { ReviewDto, ReviewListDto } from "../../types";
import { useGetProductReviewsQuery } from "../../api/storeCatalogApi";

// ── Star rating ──────────────────────────────────────────────────────────────

function StarRating({
  score,
  size = "sm",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const cls = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" }[size];
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            cls,
            i < score
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

// ── Rating summary bar ───────────────────────────────────────────────────────

function RatingSummary({ data }: { data: ReviewListDto }) {
  const avg = data.averageScore;
  const distributions = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data.items.filter((r) => r.score === star).length,
  }));
  const maxCount = Math.max(...distributions.map((d) => d.count), 1);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border bg-muted/30 p-6">
      {/* Average score */}
      <div className="flex flex-col items-center justify-center min-w-[100px] gap-1">
        <span className="text-5xl font-bold leading-none text-foreground">
          {avg.toFixed(1)}
        </span>
        <StarRating score={Math.round(avg)} size="md" />
        <span className="text-xs text-muted-foreground mt-0.5">
          {data.total.toLocaleString()} review{data.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 w-full space-y-2">
        {distributions.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-right font-medium text-muted-foreground">
              {star}
            </span>
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-4 text-muted-foreground">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Single review card ───────────────────────────────────────────────────────

function ReviewCard({ review }: { review: ReviewDto }) {
  const [expanded, setExpanded] = useState(false);
  const initial = (review.commentUser ?? "U")[0].toUpperCase();
  const palette = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-orange-500",
    "bg-rose-500",
  ];
  const color = palette[initial.charCodeAt(0) % palette.length];
  const isLong = review.comment.length > 240;

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-3 hover:shadow-sm transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-semibold text-sm",
              color,
            )}
          >
            {initial}
          </div>

          {/* Name + stars + date */}
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {review.commentUser ?? "Anonymous"}
            </p>
            <div className="flex items-center flex-wrap gap-2 mt-0.5">
              <StarRating score={review.score} />
              {review.commentDate && (
                <span className="text-xs text-muted-foreground">
                  {new Date(review.commentDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Country flag */}
        {review.flagIconUrl && (
          <img
            src={review.flagIconUrl}
            alt={review.countryCode ?? ""}
            title={review.countryCode ?? ""}
            className="h-4 w-6 rounded-sm object-cover shadow ring-1 ring-border shrink-0 mt-0.5"
          />
        )}
      </div>

      {/* Comment text */}
      <p
        className={cn(
          "text-sm text-foreground/80 leading-relaxed",
          !expanded && isLong && "line-clamp-3",
        )}
      >
        {review.comment}
      </p>
      {isLong && (
        <button
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Review photos */}
      {review.commentUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {review.commentUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt={`Review photo ${i + 1}`}
                className="h-20 w-20 rounded-xl object-cover border hover:opacity-90 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

interface ProductReviewsProps {
  productSlug: string;
}

export default function ProductReviews({ productSlug }: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isFetching } = useGetProductReviewsQuery({
    slug: productSlug,
    page,
    pageSize,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 0;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-2xl border p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
        <MessageSquare className="h-10 w-10 opacity-20" />
        <p className="font-medium">No reviews yet</p>
        <p className="text-sm">Be the first to share your experience!</p>
      </div>
    );
  }

  // ── Reviews ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Summary */}
      <RatingSummary data={data} />

      {/* Cards */}
      <div
        className={cn(
          "space-y-4",
          isFetching && "opacity-60 transition-opacity",
        )}
      >
        {data.items.map((r) => (
          <ReviewCard key={r.commentId} review={r} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
