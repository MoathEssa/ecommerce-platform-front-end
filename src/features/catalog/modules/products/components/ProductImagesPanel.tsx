import { useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ImageOff,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import {
  useAdminGetProductImagesQuery,
  useAdminUploadImageMutation,
  useAdminReorderImagesMutation,
  useAdminDeleteImageMutation,
} from "@features/catalog/api/catalogApi";
import type { ProductImageDto } from "../types";

import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";
import { extractApiError } from "@shared/lib/utils";

// ── Sortable image tile ────────────────────────────────────────────────────────

function SortableImageTile({
  image,
  isPrimary,
  onDelete,
}: {
  image: ProductImageDto;
  isPrimary: boolean;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border overflow-hidden bg-muted aspect-square",
        isDragging && "opacity-50 ring-2 ring-primary shadow-xl z-10",
      )}
    >
      <img
        src={image.url}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />

      {isPrimary && (
        <span className="absolute top-2 left-2 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow">
          Primary
        </span>
      )}

      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-2 right-7 rounded bg-background/80 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(image.id)}
        className="absolute top-2 right-2 rounded bg-background/80 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
        title="Remove image"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProductImagesPanelProps {
  productId: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductImagesPanel({
  productId,
}: ProductImagesPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localImages, setLocalImages] = useState<ProductImageDto[] | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load images from server
  const { data: serverImages = [] } = useAdminGetProductImagesQuery({
    productId,
  });

  const [uploadImage] = useAdminUploadImageMutation();
  const [reorderImages] = useAdminReorderImagesMutation();
  const [deleteImage] = useAdminDeleteImageMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Use local state for optimistic reordering; fall back to server list
  const images = localImages ?? serverImages;

  // Keep local order in sync when server list changes (e.g. after upload/delete)
  const serverIds = serverImages.map((i) => i.id).join(",");
  const localIds = (localImages ?? serverImages).map((i) => i.id).join(",");
  if (serverIds !== localIds) {
    setLocalImages(null); // reset to server order
  }

  // ── Drag end ──────────────────────────────────────────────────────────────

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const next = arrayMove(images, oldIndex, newIndex);
    setLocalImages(next);

    try {
      await reorderImages({
        productId,
        imageIds: next.map((i) => i.id),
      }).unwrap();
    } catch {
      setLocalImages(null); // revert to server order
    }
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (inputRef.current) inputRef.current.value = "";

    setApiError(null);
    setIsUploading(true);

    try {
      for (const file of files) {
        await uploadImage({ productId, file }).unwrap();
      }
    } catch (err) {
      setApiError(extractApiError(err, "Upload failed. Please try again."));
    } finally {
      setIsUploading(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete(imageId: number) {
    // Optimistic remove
    setLocalImages(images.filter((i) => i.id !== imageId));
    try {
      await deleteImage({ productId, imageId }).unwrap();
    } catch {
      setLocalImages(null); // revert
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Upload bar */}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleUpload}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading…" : "Upload Images"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Drag tiles to reorder. First image is the primary.
        </p>
      </div>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      {/* Empty state */}
      {images.length === 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <div className="rounded-full bg-muted p-3">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No images yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click to upload or drag &amp; drop
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" tabIndex={-1}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            Pick Files
          </Button>
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img, index) => (
                <SortableImageTile
                  key={img.id}
                  image={img}
                  isPrimary={index === 0}
                  onDelete={handleDelete}
                />
              ))}
              {/* Add more tile */}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">Add</span>
              </button>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
