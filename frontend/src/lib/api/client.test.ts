import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./client";

const BASE = "https://api.test/api/v1";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => vi.unstubAllGlobals());

describe("apiFetch", () => {
  it("returns parsed JSON on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ status: "ok" })));
    await expect(apiFetch("/health", { baseUrl: BASE })).resolves.toEqual({ status: "ok" });
  });

  it("throws api_not_configured when there is no base URL", async () => {
    await expect(apiFetch("/health", { baseUrl: "" })).rejects.toMatchObject({
      code: "api_not_configured",
    });
  });

  it("maps the backend error envelope to ApiError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(json({ error: { code: "not_found", message: "Nope" } }, 404)),
    );
    const err = await apiFetch("/x", { baseUrl: BASE }).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 404, code: "not_found", message: "Nope" });
  });

  it("handles non-JSON error bodies", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("boom", { status: 502 })));
    await expect(apiFetch("/x", { baseUrl: BASE })).rejects.toMatchObject({ status: 502 });
  });

  it("reports network failures clearly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    await expect(apiFetch("/x", { baseUrl: BASE })).rejects.toMatchObject({
      code: "network_error",
    });
  });

  it("sends initData as a tma Authorization header, never a user id", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({}));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/me", { baseUrl: BASE, initData: "query_id=1&hash=abc" });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "tma query_id=1&hash=abc",
    );
  });

  it("omits Authorization when there is no initData", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({}));
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/x", { baseUrl: BASE });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.headers).not.toHaveProperty("Authorization");
  });
});
