import { createContext, useContext, useMemo, type ReactNode } from "react";
import { initTelegram, type TelegramContextValue } from "./telegram";

const TelegramContext = createContext<TelegramContextValue | null>(null);

export function TelegramProvider({
  children,
  value,
}: {
  children: ReactNode;
  /** Override for tests. */
  value?: TelegramContextValue;
}) {
  const ctx = useMemo(() => value ?? initTelegram(), [value]);
  return <TelegramContext.Provider value={ctx}>{children}</TelegramContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTelegram(): TelegramContextValue {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error("useTelegram must be used inside <TelegramProvider>");
  return ctx;
}
