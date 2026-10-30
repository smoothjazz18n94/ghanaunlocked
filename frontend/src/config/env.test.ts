import { describe, expect, it } from "vitest";
import { normalizeBaseUrl } from "./env";

describe("normalizeBaseUrl", () => {
  it("trims whitespace and trailing slashes", () => {
    expect(normalizeBaseUrl("  https://api.example.com/api/v1/ ")).toBe(
      "https://api.example.com/api/v1",
    );
  });
  it("returns empty string when unset", () => {
    expect(normalizeBaseUrl(undefined)).toBe("");
  });
});
