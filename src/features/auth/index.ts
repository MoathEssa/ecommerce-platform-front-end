// Pages
export { default as SignInPage } from "./pages/SignInPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as ForgotPasswordPage } from "./pages/ForgotPasswordPage";
export { default as ResetPasswordPage } from "./pages/ResetPasswordPage";
export { default as SetPasswordPage } from "./pages/SetPasswordPage";
export { default as ForbiddenPage } from "./pages/ForbiddenPage";

// Store actions
export { default as authReducer } from "./store/authSlice";
export {
  setCredentials,
  setAuthChecked,
  clearAuth,
  logout,
} from "./store/authSlice";

// RTK Query hooks
export {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSetPasswordMutation,
} from "./api/authApi";

// Schemas
export * from "./schemas";
