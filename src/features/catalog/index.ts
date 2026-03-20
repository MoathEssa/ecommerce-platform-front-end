// Pages
export { default as CategoryListPage } from "./pages/CategoryListPage";
export { default as SaveCategoryPage } from "./pages/SaveCategoryPage";
export { default as ProductListPage } from "./pages/ProductListPage";
export { default as SaveProductPage } from "./pages/SaveProductPage";

// RTK Query hooks
export {
  // Categories
  useGetCategoriesQuery,
  useAdminGetCategoryByIdQuery,
  useAdminCreateCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
  useAdminUploadCategoryImageMutation,
  // Products
  useAdminGetProductsQuery,
  useAdminGetProductByIdQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminChangeProductStatusMutation,
  useAdminBulkChangeProductStatusMutation,
  useAdminSetProductCategoriesMutation,
  useAdminAddVariantMutation,
  useAdminUpdateVariantMutation,
  useAdminDeactivateVariantMutation,
  useAdminGetProductImagesQuery,
  useAdminUploadImageMutation,
  useAdminReorderImagesMutation,
  useAdminDeleteImageMutation,
} from "./api/catalogApi";
