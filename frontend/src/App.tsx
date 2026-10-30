import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ExplorePage } from "./pages/ExplorePage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedPage } from "./pages/SavedPage";
import { SearchPage } from "./pages/SearchPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  // BrowserRouter (not HashRouter): Telegram passes launch data in the URL hash.
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
