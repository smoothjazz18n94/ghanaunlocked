import { env } from "../../config/env";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(message: string, status: number, code = "api_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /**
   * Raw Telegram initData. Sent as `Authorization: tma <initData>` so the
   * BACKEND can verify its signature. We never send a bare Telegram user ID
   * as proof of identity.
   */
  initData?: string | null;
  baseUrl?: string;
}

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const base = opts.baseUrl ?? env.apiBaseUrl;
  if (!base) {
    throw new ApiError("The API address is not configured.", 0, "api_not_configured");
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.initData) headers.Authorization = `tma ${opts.initData}`;

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError("Can't reach the server. Check your connection.", 0, "network_error");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    let code = "api_error";
    try {
      const data = await response.json();
      if (data?.error?.message) message = data.error.message;
      if (data?.error?.code) code = data.error.code;
    } catch {
      /* non-JSON error body: keep the generic message */
    }
    throw new ApiError(message, response.status, code);
  }

  return (await response.json()) as T;
}
