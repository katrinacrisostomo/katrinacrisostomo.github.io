import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 sm:px-6 ${
    isActive
      ? "font-medium text-black"
      : "font-normal text-neutral-400 hover:text-black"
  }`;

export default function Header() {
  return (
    <header className="shrink-0 border-b border-neutral-200">
      <div className="mx-auto flex max-w-8xl flex-col items-center gap-6 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <div className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-baseline sm:gap-5">
          <span className="font-mono text-sm font-medium uppercase">
            Katrina Crisostomo
          </span>
          <span className="text-sm font-mono text-neutral-400 sm:text-sm">
            Product Engineer + Designer
          </span>
        </div>
        <nav
          className="flex w-full justify-center gap-4 font-mono text-xs uppercase sm:w-auto sm:gap-8 sm:text-sm"
          aria-label="Primary"
        >
          <NavLink to="/" end className={navLinkClass}>
            Work
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
