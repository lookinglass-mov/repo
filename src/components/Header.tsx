import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "@/lib/useTheme";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const account = session ? { to: "/portal", label: "Portal" } : { to: "/signin", label: "Sign in" };

  const item = ({ isActive }: { isActive: boolean }) =>
    `ui font-medium min-h-11 inline-flex items-center border-b-2 ${
      isActive ? "border-violet" : "border-transparent hover:border-pane"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-pane bg-paper/85 backdrop-blur">
      <div className="page flex h-20 items-center justify-between gap-4">
          <Link to="/" aria-label="Lookinglass home" className="inline-flex h-12 w-12 items-center justify-center" onClick={() => setOpen(false)}>
            <Logo className="h-12 w-12" />
          </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={item}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Link to={account.to} className="ui mr-2 hidden min-h-11 items-center px-3 font-medium sm:inline-flex">
            {account.label}
          </Link>
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="icon-button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="icon-button sm:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="page flex flex-col gap-1 border-t border-pane py-3 sm:hidden">
          {[...nav, account].map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 font-display text-2xl font-semibold"
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
