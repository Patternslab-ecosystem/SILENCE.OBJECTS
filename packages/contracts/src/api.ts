/** Standard API response envelope */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: string;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

/** API error response */
export interface ApiError {
  error: string;
  code: string;
  timestamp: string;
}
