export default function Header() {
  return (
    <header className="shrink-0 border-b border-neutral-200">
      <div className="mx-auto flex max-w-8xl flex-col items-center gap-6 px-4 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <div className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-baseline sm:gap-5">
          <span className="font-mono text-sm font-medium uppercase">
            Katrina Crisostomo
          </span>
          <span className="text-sm font-mono uppercase text-neutral-400 sm:text-sm">
            Product Engineer + Designer
          </span>
        </div>
        <nav
          className="flex w-full justify-center gap-4 font-mono text-xs uppercase sm:w-auto sm:gap-8 sm:text-sm"
          aria-label="Primary"
        >
          <a className="px-3 font-medium text-black sm:px-6">Work</a>
          <a
            className="px-3 font-normal text-neutral-400 hover:text-black sm:px-6"
            // href="#about"
          >
            About
          </a>
          <a
            className="px-3 font-normal text-neutral-400 hover:text-black sm:px-6"
            // href="/resume.pdf"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
