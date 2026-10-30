export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { to: "/explore", label: "Explore", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.5 5.5-2 5-5 2 2-5z" },
  { to: "/search", label: "Search", icon: "M10.5 3a7.5 7.5 0 1 0 4.6 13.4l4.5 4.5 1.4-1.4-4.5-4.5A7.5 7.5 0 0 0 10.5 3z" },
  { to: "/saved", label: "Saved", icon: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" },
  { to: "/profile", label: "Profile", icon: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z" },
] as const;
