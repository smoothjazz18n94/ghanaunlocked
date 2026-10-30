import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "./App";
import { BROWSER_FALLBACK, type TelegramContextValue } from "./lib/telegram/telegram";
import { TelegramProvider } from "./lib/telegram/TelegramProvider";

function renderAt(path: string, tg: TelegramContextValue = BROWSER_FALLBACK) {
  return render(
    <TelegramProvider value={tg}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </TelegramProvider>,
  );
}

describe("navigation shell", () => {
  it("shows all five navigation items", () => {
    renderAt("/");
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const label of ["Home", "Explore", "Search", "Saved", "Profile"]) {
      expect(nav).toHaveTextContent(label);
    }
  });

  it.each([
    ["/explore", "Explore"],
    ["/search", "Search"],
    ["/saved", "Saved"],
    ["/profile", "Profile"],
  ])("renders %s", (path, heading) => {
    renderAt(path);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
  });

  it("renders a not-found page for unknown routes", () => {
    renderAt("/does-not-exist");
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("shows the preview banner outside Telegram", () => {
    renderAt("/");
    expect(screen.getByRole("note")).toHaveTextContent(/preview mode/i);
  });

  it("hides the banner and greets the user inside Telegram", () => {
    renderAt("/", {
      mode: "telegram",
      platform: "ios",
      user: { firstName: "Kwame" },
      rawInitData: "x",
    });
    expect(screen.queryByRole("note")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Akwaaba, Kwame");
  });

  it("Home degrades gracefully when no API is configured", async () => {
    renderAt("/");
    expect(await screen.findByText("Server not connected yet")).toBeInTheDocument();
  });
});
