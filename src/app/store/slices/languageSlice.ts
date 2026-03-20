import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Language = "en" | "ar";

interface LanguageState {
  current: Language;
}

const initialState: LanguageState = {
  current: (localStorage.getItem("lang") as Language) ?? "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.current = action.payload;
      localStorage.setItem("lang", action.payload);
    },
    toggleLanguage(state) {
      const next = state.current === "en" ? "ar" : "en";
      state.current = next;
      localStorage.setItem("lang", next);
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
