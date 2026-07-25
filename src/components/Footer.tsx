export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <span className="font-serif text-sm font-semibold text-ink">
          Gazette
        </span>
        <div className="flex items-center gap-6 font-mono text-xs text-ink/50">
          <a
            href="https://x.com/gazettecr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            @gazettecr
          </a>
          <a href="mailto:hola@gazette.cr" className="hover:text-accent">
            hola@gazette.cr
          </a>
          <a href="/privacy" className="hover:text-accent">
            Privacidad
          </a>
          <a href="/terms" className="hover:text-accent">
            Términos
          </a>
          <span>© {new Date().getFullYear()} Gazette</span>
        </div>
      </div>
    </footer>
  );
}
