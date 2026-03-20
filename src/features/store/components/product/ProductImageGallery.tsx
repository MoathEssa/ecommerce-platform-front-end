import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@shared/lib/utils";
import type { ProductImageDto } from "../../types";

interface ProductImageGalleryProps {
  images: ProductImageDto[];
  title: string;
}

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = sorted[selectedIndex];

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted/50">
        <ImageOff className="h-16 w-16 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted/30">
        <img
          src={selectedImage.url}
          alt={`${title} - Image ${selectedIndex + 1}`}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                idx === selectedIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/30",
              )}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
