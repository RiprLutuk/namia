// Browser requests always use the application's same-origin server proxy.
export const API_BASE_URL = "";
export interface ApiResult<T> {
  success: boolean;
  data: T;
  message?: string;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  fetcher: typeof fetch = fetch,
): Promise<ApiResult<T>> {
  const headers = new Headers(options.headers);
  if (options.method && options.method !== "GET") headers.set("content-type", "application/json");
  const response = await fetcher(path, { ...options, headers, credentials: "same-origin" });
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || !result.success)
    throw new ApiError(result.message || "Permintaan gagal. Silakan coba lagi.", response.status);
  return result;
}
