import {
  init,
  isTMA,
  miniApp,
  retrieveLaunchParams,
  retrieveRawInitData,
  viewport,
} from "@telegram-apps/sdk";

export interface TelegramUser {
  firstName: string;
  lastName?: string;
  username?: string;
}

export interface TelegramContextValue {
  /** "telegram" inside the Mini App, "browser" when opened anywhere else. */
  mode: "telegram" | "browser";
  platform: string;
  /**
   * Display-only. NOT verified. The backend must validate `rawInitData`
   * before treating anyone as authenticated.
   */
  user: TelegramUser | null;
  /** Raw signed initData string to forward to the backend. Null outside Telegram. */
  rawInitData: string | null;
}

/** Development fallback so the UI can be built and previewed in a normal browser. */
export const BROWSER_FALLBACK: TelegramContextValue = {
  mode: "browser",
  platform: "browser",
  user: null,
  rawInitData: null,
};

export function initTelegram(): TelegramContextValue {
  try {
    if (!isTMA()) return BROWSER_FALLBACK;

    init();
    if (miniApp.mountSync.isAvailable()) miniApp.mountSync();
    if (miniApp.ready.isAvailable()) miniApp.ready();
    // Best effort: open the app at full height.
    if (viewport.mount.isAvailable()) {
      viewport
        .mount()
        .then(() => viewport.expand.isAvailable() && viewport.expand())
        .catch(() => undefined);
    }

    const launch = retrieveLaunchParams();
    const rawUser = launch.tgWebAppData?.user;
    return {
      mode: "telegram",
      platform: String(launch.tgWebAppPlatform ?? "unknown"),
      user: rawUser
        ? {
            firstName: rawUser.first_name,
            lastName: rawUser.last_name,
            username: rawUser.username,
          }
        : null,
      rawInitData: retrieveRawInitData() ?? null,
    };
  } catch (err) {
    console.warn("Telegram SDK initialisation failed; using browser fallback.", err);
    return BROWSER_FALLBACK;
  }
}
