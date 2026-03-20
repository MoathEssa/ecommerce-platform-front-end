import { useEffect, useRef } from "react";
import { ImageOff, Upload, X } from "lucide-react";

import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryImageUploadProps {
  /**
   * The persisted URL (already on blob storage) — shown when no pending file.
   * Pass null when no image is saved yet.
   */
  savedUrl: string | null;
  /**
   * A locally-selected File not yet uploaded — shown as an object-URL preview.
   * null means no pending file.
   */
  pendingFile: File | null;
  /** Called when the user picks a new file (or clears the pending selection). */
  onFileSelect: (file: File | null) => void;
  /** Called when the user explicitly removes the already-saved image. */
  onSavedRemove: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryImageUpload({
  savedUrl,
  pendingFile,
  onFileSelect,
  onSavedRemove,
}: CategoryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Build a local object-URL for preview; revoke on change to prevent memory leaks
  const previewUrl = pendingFile ? URL.createObjectURL(pendingFile) : null;
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayUrl = previewUrl ?? savedUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove() {
    if (pendingFile) {
      onFileSelect(null);
    } else {
      onSavedRemove();
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {displayUrl ? (
        <div className="relative rounded-lg border overflow-hidden bg-muted/30 h-40 flex items-center justify-center">
          <img
            src={displayUrl}
            alt="Category"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-background/80 p-1 shadow hover:bg-background transition-colors"
            title="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {pendingFile && (
            <span className="absolute bottom-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground">
              Pending upload
            </span>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg border-2 border-dashed h-40 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer",
            "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/20",
          )}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <ImageOff className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Click to upload an image
          </span>
          <span className="text-xs text-muted-foreground/60">
            JPEG, PNG or WebP
          </span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button (alternative to clicking the zone) */}
      {!displayUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-3.5 w-3.5" />
          Choose image
        </Button>
      )}
    </div>
  );
}
