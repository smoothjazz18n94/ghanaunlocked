import { useTelegram } from "../lib/telegram/TelegramProvider";

export function ProfilePage() {
  const { mode, user, platform } = useTelegram();
  return (
    <section className="page">
      <h1>Profile</h1>
      {user ? (
        <p className="lead">
          {user.firstName} {user.lastName ?? ""}
          {user.username ? ` (@${user.username})` : ""}
        </p>
      ) : (
        <p className="lead">You're not signed in.</p>
      )}
      <dl className="meta">
        <dt>Opened in</dt>
        <dd>{mode === "telegram" ? `Telegram (${platform})` : "Web browser"}</dd>
      </dl>
      <p className="note">
        Name shown for display only. Sign-in will be verified by our server in a later release.
      </p>
    </section>
  );
}
