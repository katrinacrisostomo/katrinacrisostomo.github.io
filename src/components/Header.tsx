export default function Header() {
  return (
    <header className="shrink-0 border-b border-neutral-200">
      <div className="mx-auto flex max-w-8xl flex-col gap-6 px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <div className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-baseline sm:gap-5">
          <span className="font-mono text-sm font-medium uppercase">
            Katrina Crisostomo
          </span>
          <span className="text-sm font-mono uppercase text-neutral-400 sm:text-sm">
            Product Engineer + Designer
          </span>
        </div>
        <nav
          className="flex gap-8 font-mono text-sm uppercase sm:text-sm"
          aria-label="Primary"
        >
          <a className="px-6 font-medium text-black" href="#work">
            Work
          </a>
          <a
            className="px-6 font-normal text-neutral-400 hover:text-black"
            href="#about"
          >
            About
          </a>
          <a
            className="px-6 font-normal text-neutral-400 hover:text-black"
            href="/resume.pdf"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
