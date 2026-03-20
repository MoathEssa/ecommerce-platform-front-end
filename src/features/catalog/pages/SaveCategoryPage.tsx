import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Info } from "lucide-react";

import {
  useAdminGetCategoriesQuery,
  useAdminGetCategoryByIdQuery,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminUploadCategoryImageMutation,
} from "@features/catalog/api/catalogApi";
import { adminFlatToTree } from "../modules/categories/utils/categoryUtils";

import {
  categoryFormSchema,
  type CategoryFormValues,
  type CategoryFormInput,
} from "../modules/categories/schemas/categorySchemas";
import {
  buildLevelsForId,
  findNode,
} from "../modules/categories/utils/categoryUtils";
import type { CascadeLevel } from "../modules/categories/components/CategoryCascadeSelector";
import CascadeSelectorPanel from "../modules/categories/components/CascadeSelectorPanel";
import CategoryFormPanel from "../modules/categories/components/CategoryFormPanel";

import { Button } from "@shared/ui/button";

// -- Helpers ------------------------------------------------------------------

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function buildBreadcrumb(levels: CascadeLevel[]): string[] {
  return levels
    .filter((l) => l.selectedId !== null)
    .map((l) => findNode(l.options, l.selectedId!)?.name ?? "");
}

// -- Page ---------------------------------------------------------------------

export default function SaveCategoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id") ? Number(searchParams.get("id")) : null;

  // CJ import params (present when navigating from CjCategoriesPage)
  const cjCategoryId = searchParams.get("cjCategoryId");
  const cjName = searchParams.get("cjName");
  const isImportingFromCj = Boolean(cjCategoryId && cjName);

  const [editingId, setEditingId] = useState<number | null>(editId);
  const formMode = editingId !== null ? "edit" : "create";

  // Tree data
  const { data: adminCats = [], isLoading: treeLoading } =
    useAdminGetCategoriesQuery();
  const tree = useMemo(() => adminFlatToTree(adminCats), [adminCats]);

  // Admin detail query driven by editingId
  const { data: adminCat, isLoading: adminLoading } =
    useAdminGetCategoryByIdQuery(editingId!, { skip: editingId === null });

  // Mutations
  const [createCategory, { isLoading: isCreating }] =
    useAdminCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useAdminUpdateCategoryMutation();
  const [uploadCategoryImage] = useAdminUploadCategoryImageMutation();

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isSaving = isCreating || isUpdating || isUploading;

  // Form
  const form = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: cjName ?? "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: null,
      sortOrder: 0,
      isActive: true,
    },
  });

  // Auto-generate slug from pre-filled CJ name on first render
  useEffect(() => {
    if (isImportingFromCj && cjName) {
      form.setValue("slug", toSlug(cjName), { shouldValidate: false });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Levels derived from tree + editId; user overrides stored in delta
  const treeEditKey = `${tree.length}-${editId ?? "null"}`;
  const baseLevels = useMemo<CascadeLevel[]>(() => {
    if (!tree.length) return [{ selectedId: null, options: [] }];
    if (editId !== null) return buildLevelsForId(tree, editId);
    return [{ selectedId: null, options: tree }];
  }, [tree, editId]);

  const [levelsDelta, setLevelsDelta] = useState<{
    forKey: string;
    levels: CascadeLevel[];
  } | null>(null);
  const levels =
    levelsDelta?.forKey === treeEditKey ? levelsDelta.levels : baseLevels;

  function setLevels(newLevels: CascadeLevel[]) {
    setLevelsDelta({ forKey: treeEditKey, levels: newLevels });
  }

  // Fill form when adminCat loads or editingId changes
  useEffect(() => {
    if (adminCat && editingId !== null && adminCat.id === editingId) {
      form.reset({
        name: adminCat.name,
        slug: adminCat.slug,
        description: adminCat.description ?? "",
        imageUrl: adminCat.imageUrl ?? "",
        parentId: adminCat.parentId ?? null,
        sortOrder: adminCat.sortOrder,
        isActive: adminCat.isActive,
      });
    }
  }, [adminCat, editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  function getParentIdFromLevels(): number | null {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (levels[i].selectedId !== null) return levels[i].selectedId!;
    }
    return null;
  }

  function handleLevelsChange(newLevels: CascadeLevel[]) {
    setLevels(newLevels);
    const lastLevel = newLevels[newLevels.length - 1];
    if (lastLevel.selectedId === null) {
      setEditingId(null);
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
  }

  function handleEditNode(id: number) {
    setEditingId(id);
  }

  function handleNameBlur(name: string) {
    form.setValue("slug", toSlug(name), { shouldValidate: true });
  }

  async function onSubmit(values: CategoryFormValues) {
    const parentId =
      formMode === "create"
        ? getParentIdFromLevels()
        : (values.parentId ?? null);

    const body = {
      name: values.name,
      slug: values.slug || null,
      description: values.description || null,
      imageUrl: values.imageUrl || null,
      parentId,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
      // Supplier linkage (only on create; update preserves existing)
      ...(formMode === "create" && isImportingFromCj
        ? { externalCategoryId: cjCategoryId, supplier: 1 }
        : {}),
    };

    let categoryId = editingId;

    if (formMode === "create") {
      const created = await createCategory(body).unwrap();
      categoryId = created.data.id;
    } else {
      await updateCategory({ id: editingId!, ...body }).unwrap();
    }

    // If a new image was picked, upload it now (server-side SAS, never exposed)
    if (pendingFile && categoryId !== null) {
      setIsUploading(true);
      try {
        await uploadCategoryImage({ categoryId, file: pendingFile }).unwrap();
      } finally {
        setIsUploading(false);
      }
    }

    setPendingFile(null);
  }

  const breadcrumb = buildBreadcrumb(levels);
  const isEditingNodeLoading =
    formMode === "edit" && editingId !== null && adminLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/catalog/categories")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Manage Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Drill down to place your category, then fill in the details.
          </p>
        </div>
      </div>

      {/* CJ import banner */}
      {isImportingFromCj && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Importing from CJ Dropshipping —&nbsp;
            <strong>{cjName}</strong>. The category will be linked to CJ
            category&nbsp;
            <code className="rounded bg-blue-100 px-1 text-xs dark:bg-blue-900">
              {cjCategoryId}
            </code>
            .
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Left: Cascade selector */}
        <CascadeSelectorPanel
          levels={levels}
          onLevelsChange={handleLevelsChange}
          onEditNode={handleEditNode}
          treeLoading={treeLoading}
          breadcrumb={breadcrumb}
          formMode={formMode}
        />

        {/* Right: Form */}
        <CategoryFormPanel
          form={form}
          formMode={formMode}
          editingId={editingId}
          isSaving={isSaving}
          isLoading={isEditingNodeLoading}
          pendingFile={pendingFile}
          onPendingFileChange={setPendingFile}
          onNameBlur={handleNameBlur}
          onSubmit={onSubmit}
          onCancel={() => navigate("/catalog/categories")}
        />
      </div>
    </div>
  );
}
