import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-ink/40">
        Error 404
      </span>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-ink">
        Esta página no existe
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink/60">
        El link puede estar roto o la página se movió. Volvé al inicio para
        seguir desde ahí.
      </p>
      <Link
        href="/"
        className="mt-8 border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
