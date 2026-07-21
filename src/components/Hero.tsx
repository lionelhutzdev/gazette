export default function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-accent">
          Diario Oficial La Gaceta · Costa Rica
        </p>
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Tu empresa puede salir mencionada en La Gaceta mañana y nadie te lo
          va a decir.
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-ink/70">
          Gazette revisa el Diario Oficial todos los días hábiles y te
          escribe un email el mismo día si aparece una empresa, persona o
          palabra clave que configuraste. Embargos, demandas, cambios de
          junta directiva, decretos, avisos legales.
        </p>
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href="#pricing"
            className="bg-accent px-7 py-3.5 font-medium text-paper transition-colors hover:bg-accent-dark"
          >
            Empezar por $29/mes
          </a>
          <p className="font-mono text-xs text-ink/50">
            hasta 3 keywords · cancelás cuando querés
          </p>
        </div>
      </div>
    </section>
  );
}
