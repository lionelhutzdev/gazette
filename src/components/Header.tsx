export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">
            Gazette
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-widest text-ink/40 sm:inline">
            / vigilancia de La Gaceta
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="text-sm text-ink/60 hover:text-accent"
          >
            Ingresar
          </a>
          <a
            href="#pricing"
            className="border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Empezar
          </a>
        </div>
      </div>
    </header>
  );
}
