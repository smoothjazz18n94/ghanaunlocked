import { env } from "../config/env";
import { getHealth } from "../lib/api/health";
import { useApiQuery } from "../lib/api/useApiQuery";
import { ApiError } from "../lib/api/client";
import { useTelegram } from "../lib/telegram/TelegramProvider";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";

function ApiStatus() {
  const { state, retry } = useApiQuery(getHealth);

  if (state.status === "loading") return <LoadingState label="Checking connection…" />;
  if (state.status === "error") {
    const notConfigured =
      state.error instanceof ApiError && state.error.code === "api_not_configured";
    return (
      <ErrorState
        title={notConfigured ? "Server not connected yet" : "Can't reach the server"}
        message={
          notConfigured
            ? "The app works without it for now. Discovery features arrive in a later release."
            : state.error.message
        }
        onRetry={notConfigured ? undefined : retry}
      />
    );
  }
  return (
    <p className="status status--ok">
      Server connected · v{state.data.version} ({state.data.environment})
    </p>
  );
}

export function HomePage() {
  const { user } = useTelegram();
  return (
    <section className="page">
      <h1>{user ? `Akwaaba, ${user.firstName}` : "Akwaaba"}</h1>
      <p className="lead">
        Trusted places, services and businesses across Accra and Kumasi.
      </p>
      {/* Hidden for end users in production until an API URL is configured. */}
      {(env.isDev || env.apiBaseUrl) && <ApiStatus />}
    </section>
  );
}
