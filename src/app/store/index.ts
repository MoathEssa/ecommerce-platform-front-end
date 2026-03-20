import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "@features/auth/store/authSlice";
import languageReducer from "./slices/languageSlice";
import { baseApi } from "@shared/api";
import { rtkApiNotificationMiddleware } from "./middleware/rtkApiNotificationMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(rtkApiNotificationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks — defined here so TS resolves RootState/AppDispatch directly
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
