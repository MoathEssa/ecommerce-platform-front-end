import { Loader2, Save } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type {
  CategoryFormValues,
  CategoryFormInput,
} from "../schemas/categorySchemas";
import CategoryImageUpload from "./CategoryImageUpload";

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Switch } from "@shared/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Badge } from "@shared/ui/badge";
import { Skeleton } from "@shared/ui/skeleton";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryFormPanelProps {
  form: UseFormReturn<CategoryFormInput, unknown, CategoryFormValues>;
  formMode: "create" | "edit";
  editingId: number | null;
  isSaving: boolean;
  isLoading: boolean;
  pendingFile: File | null;
  onPendingFileChange: (file: File | null) => void;
  onNameBlur: (name: string) => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryFormPanel({
  form,
  formMode,
  editingId,
  isSaving,
  isLoading,
  pendingFile,
  onPendingFileChange,
  onNameBlur,
  onSubmit,
  onCancel,
}: CategoryFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">
          {formMode === "create" ? "New Category" : "Edit Category"}
        </h2>
        {formMode === "edit" && editingId && (
          <Badge variant="secondary" className="text-xs">
            Editing ID #{editingId}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Men's Shoes"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        onNameBlur(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="auto-generated-from-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      rows={3}
                      placeholder="Optional short description"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 resize-none dark:bg-input/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <CategoryImageUpload
                      savedUrl={field.value || null}
                      pendingFile={pendingFile}
                      onFileSelect={onPendingFileChange}
                      onSavedRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sort Order */}
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Deactivating will disable all products under this category
                      for all clients.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving
                  ? "Saving…"
                  : formMode === "create"
                    ? "Create Category"
                    : "Save Changes"}
              </Button>
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
