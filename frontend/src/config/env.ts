/** Single place that reads build-time environment variables (all public). */
export function normalizeBaseUrl(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  isDev: import.meta.env.DEV,
} as const;
