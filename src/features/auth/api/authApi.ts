import { baseApi } from "@shared/api";
import type { ApiResponse, LoginResponse, AuthResponse } from "@shared/types";
import {
  setCredentials,
  setAuthChecked,
  clearAuth,
} from "@features/auth/store/authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (body) => ({ url: "/Auth/login", method: "POST", body }),
        transformResponse: (response: ApiResponse<LoginResponse>) =>
          response.data,
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
              }),
            );
          } catch {
            // error handled in page via .unwrap()
          }
        },
      },
    ),

    googleLogin: builder.mutation<LoginResponse, { idToken: string }>({
      query: (body) => ({ url: "/Auth/google", method: "POST", body }),
      transformResponse: (response: ApiResponse<LoginResponse>) =>
        response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken }),
          );
        } catch {
          // error handled in page/component via .unwrap()
        }
      },
    }),

    register: builder.mutation<
      LoginResponse,
      { email: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({ url: "/Auth/register", method: "POST", body }),
      transformResponse: (response: ApiResponse<LoginResponse>) =>
        response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken }),
          );
        } catch {
          // error handled in page via .unwrap()
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "/Auth/logout", method: "POST" }),
    }),

    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => "/Auth/me",
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthChecked(data));
        } catch {
          dispatch(clearAuth());
        }
      },
    }),

    forgotPassword: builder.mutation<ApiResponse<void>, { email: string }>({
      query: (body) => ({ url: "/Auth/forgot-password", method: "POST", body }),
    }),

    setPassword: builder.mutation<
      ApiResponse<void>,
      {
        token: string;
        email: string;
        password: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({ url: "/Auth/set-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useSetPasswordMutation,
} = authApi;
