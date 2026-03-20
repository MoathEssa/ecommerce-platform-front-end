// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  userId: number;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  user: AuthResponse;
  accessToken: string;
}

export interface CurrentUserResponse {
  userId: number;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  person?: {
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    gender?: string;
  };
}

// ── API wrapper ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors?: string[];
}

/** Alias used by the RTK Query notification middleware */
export type IGenericApiResponse<T> = ApiResponse<T>;

// ── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
