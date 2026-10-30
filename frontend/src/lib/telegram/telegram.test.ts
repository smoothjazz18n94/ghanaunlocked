import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@telegram-apps/sdk");
});

describe("initTelegram", () => {
  it("falls back to browser mode outside Telegram (real SDK, jsdom)", async () => {
    const { initTelegram } = await import("./telegram");
    const ctx = initTelegram();
    expect(ctx.mode).toBe("browser");
    expect(ctx.rawInitData).toBeNull();
    expect(ctx.user).toBeNull();
  });

  it("uses Telegram data when running inside Telegram (mocked SDK)", async () => {
    const avail = { isAvailable: () => true };
    vi.doMock("@telegram-apps/sdk", () => ({
      isTMA: () => true,
      init: vi.fn(),
      miniApp: {
        mountSync: Object.assign(vi.fn(), avail),
        ready: Object.assign(vi.fn(), avail),
      },
      viewport: {
        mount: Object.assign(vi.fn().mockResolvedValue(undefined), avail),
        expand: Object.assign(vi.fn(), avail),
      },
      retrieveLaunchParams: () => ({
        tgWebAppPlatform: "android",
        tgWebAppData: { user: { first_name: "Ama", username: "ama" } },
      }),
      retrieveRawInitData: () => "query_id=1&hash=abc",
    }));
    const { initTelegram } = await import("./telegram");
    const ctx = initTelegram();
    expect(ctx.mode).toBe("telegram");
    expect(ctx.platform).toBe("android");
    expect(ctx.user?.firstName).toBe("Ama");
    expect(ctx.rawInitData).toBe("query_id=1&hash=abc");
  });

  it("falls back safely if the SDK throws", async () => {
    vi.doMock("@telegram-apps/sdk", () => ({
      isTMA: () => true,
      init: () => {
        throw new Error("boom");
      },
      miniApp: {},
      viewport: {},
      retrieveLaunchParams: vi.fn(),
      retrieveRawInitData: vi.fn(),
    }));
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { initTelegram } = await import("./telegram");
    expect(initTelegram().mode).toBe("browser");
  });
});
