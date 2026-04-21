/**
 * Admin API client — all requests go through Next.js API proxy routes
 * which forward the httpOnly cookie automatically.
 * On 401, attempts one token refresh before failing.
 */

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

type RequestOptions = {
  params?: Record<string, string>;
  signal?: AbortSignal;
};

const API_URL = process.env.API_URL || "http://localhost:8000";

async function refreshTokens(): Promise<boolean> {
  const res = await fetch("/api/auth/refresh", { method: "POST" });
  return res.ok;
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const isServer = typeof window === "undefined";

  let url: string;
  const headers: Record<string, string> = {};

  if (isServer) {
    // Server-side: call FastAPI directly, passing token from cookies
    url = `${API_URL}/api/v1${endpoint}`;
    // Token must be passed via the caller on server side
  } else {
    // Client-side: go through Next.js API proxy that auto-attaches cookies
    url = `/api/admin${endpoint}`;
  }

  if (options.params) {
    const search = new URLSearchParams(options.params);
    url += `?${search.toString()}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options.signal,
  };

  let res = await fetch(url, fetchOptions);

  // Auto-refresh on 401 (client-side only)
  if (res.status === 401 && !isServer) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      res = await fetch(url, fetchOptions);
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new AdminApiError(res.status, error.detail || "Request failed");
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const adminApi = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>("GET", endpoint, undefined, options);
  },
  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>("POST", endpoint, body, options);
  },
  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>("PATCH", endpoint, body, options);
  },
  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>("DELETE", endpoint, undefined, options);
  },
};
