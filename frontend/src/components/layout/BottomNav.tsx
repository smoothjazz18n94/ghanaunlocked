import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            "bottom-nav__link" + (isActive ? " bottom-nav__link--active" : "")
          }
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d={item.icon} fill="currentColor" />
          </svg>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
