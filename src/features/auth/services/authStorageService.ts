import type { AuthResponse } from "@shared/types";

const STORAGE_KEY = "auth";

interface StoredAuth {
  user: AuthResponse;
  accessToken: string;
}

const authStorageService = {
  load(): StoredAuth | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
      return null;
    }
  },

  save(data: StoredAuth): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default authStorageService;
