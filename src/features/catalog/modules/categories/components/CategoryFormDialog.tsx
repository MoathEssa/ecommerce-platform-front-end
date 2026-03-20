import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
} from "@features/catalog/api/catalogApi";
import type { FlatCategory } from "../types";
import {
  categoryFormSchema,
  type CategoryFormValues,
  type CategoryFormInput,
} from "../schemas/categorySchemas";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Switch } from "@shared/ui/switch";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Returns all descendant IDs of a node to prevent circular parent selection */
function getDescendantIds(
  allCategories: FlatCategory[],
  id: number,
): Set<number> {
  const result = new Set<number>();
  const queue = [id];
  while (queue.length) {
    const current = queue.shift()!;
    for (const cat of allCategories) {
      if (cat.parentId === current) {
        result.add(cat.id);
        queue.push(cat.id);
      }
    }
  }
  return result;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: FlatCategory;
  allCategories: FlatCategory[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  category,
  allCategories,
}: CategoryFormDialogProps) {
  const [createCategory, { isLoading: isCreating }] =
    useAdminCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useAdminUpdateCategoryMutation();

  const isLoading = isCreating || isUpdating;

  const form = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: null,
      sortOrder: 0,
      isActive: true,
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (open && mode === "edit" && category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: "",
        imageUrl: category.imageUrl ?? "",
        parentId: category.parentId ?? null,
        sortOrder: 0,
        isActive: true,
      });
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        parentId: null,
        sortOrder: 0,
        isActive: true,
      });
    }
  }, [open, mode, category, form]);

  // Auto-generate slug from name
  function handleNameBlur(name: string) {
    form.setValue("slug", toSlug(name), { shouldValidate: true });
  }

  async function onSubmit(values: CategoryFormValues) {
    const body = {
      name: values.name,
      slug: values.slug || null,
      description: values.description || null,
      imageUrl: values.imageUrl || null,
      parentId: values.parentId ?? null,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    };

    if (mode === "create") {
      await createCategory(body).unwrap();
    } else {
      await updateCategory({ id: category!.id, ...body }).unwrap();
    }
    onOpenChange(false);
  }

  // Parent options — exclude self and descendants when editing
  const disabledIds =
    mode === "edit" && category
      ? new Set([category.id, ...getDescendantIds(allCategories, category.id)])
      : new Set<number>();

  const parentOptions = allCategories.filter((c) => !disabledIds.has(c.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-1"
          >
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
                        handleNameBlur(e.target.value);
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

            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parent Category */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    value={field.value?.toString() ?? "none"}
                    onValueChange={(val) =>
                      field.onChange(val === "none" ? null : Number(val))
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="None (root category)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (root category)</SelectItem>
                      {parentOptions.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {"  ".repeat(cat.depth)}
                          {cat.depth > 0 ? "↳ " : ""}
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input type="number" min={0} {...field} />
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Creating…"
                    : "Saving…"
                  : mode === "create"
                    ? "Create"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
