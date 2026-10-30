import { Outlet } from "react-router-dom";
import { useTelegram } from "../../lib/telegram/TelegramProvider";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  const { mode } = useTelegram();
  return (
    <div className="shell">
      <header className="shell__header">
        <span className="shell__brand">Ghana Unlocked</span>
        <span className="shell__cities">Accra · Kumasi</span>
      </header>
      {mode === "browser" && (
        <div className="banner" role="note">
          Preview mode. Open this app from Telegram for the full experience.
        </div>
      )}
      <main className="shell__main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
