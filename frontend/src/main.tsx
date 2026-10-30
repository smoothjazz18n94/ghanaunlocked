import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TelegramProvider } from "./lib/telegram/TelegramProvider";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </StrictMode>,
);
