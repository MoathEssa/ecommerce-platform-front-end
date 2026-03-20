import { useState } from "react";

import { useAdminDeleteCategoryMutation } from "@features/catalog/api/catalogApi";
import { extractApiError } from "@shared/lib/utils";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@shared/ui/alert-dialog";

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: { id: number; name: string } | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryDeleteDialog({
  open,
  onOpenChange,
  category,
}: CategoryDeleteDialogProps) {
  const [deleteCategory, { isLoading }] = useAdminDeleteCategoryMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!category) return;
    setApiError(null);
    try {
      await deleteCategory(category.id).unwrap();
      onOpenChange(false);
    } catch (err) {
      setApiError(extractApiError(err));
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) setApiError(null);
    onOpenChange(open);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{category?.name}</strong> will be permanently deleted. This
            cannot be undone.
            <br />
            <span className="text-xs mt-1 block">
              Categories with sub-categories or assigned products cannot be
              deleted.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {apiError && (
          <p className="text-sm text-destructive px-1">{apiError}</p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
