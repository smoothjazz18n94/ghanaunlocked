import { apiFetch } from "./client";

export interface HealthResponse {
  status: "ok";
  service: string;
  version: string;
  environment: string;
  timestamp: string;
}

export const getHealth = (signal?: AbortSignal) =>
  apiFetch<HealthResponse>("/health", { signal });
