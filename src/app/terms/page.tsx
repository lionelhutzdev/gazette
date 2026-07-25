export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Términos de servicio
        </h1>
        <p className="mt-2 text-sm text-ink/60">Última actualización: julio 2026.</p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-ink/80">
          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Qué es Gazette
            </h2>
            <p className="mt-2">
              Gazette es un servicio que revisa automáticamente las ediciones de La
              Gaceta de Costa Rica y te avisa por email cuando encuentra las keywords
              que configuraste.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Sin garantías
            </h2>
            <p className="mt-2">
              Gazette depende de que el sitio oficial de La Gaceta esté disponible y de
              que su estructura no cambie. No garantizamos que el servicio detecte el
              100% de las coincidencias, ni que esté libre de errores o interrupciones.
              Gazette es una herramienta de apoyo, no un sustituto de la revisión
              oficial de La Gaceta por tu parte o por un profesional legal.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Límite de responsabilidad
            </h2>
            <p className="mt-2">
              No somos responsables por decisiones tomadas en base a los emails de
              Gazette, ni por consecuencias derivadas de una coincidencia que no se
              detectó o que se detectó tarde.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Tu cuenta
            </h2>
            <p className="mt-2">
              Podés cancelar tu cuenta cuando quieras. El plan actual tiene un límite de
              3 keywords activas por cuenta.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">Contacto</h2>
            <p className="mt-2">
              Preguntas sobre estos términos:{" "}
              <a href="mailto:hola@gazette.cr" className="text-accent hover:underline">
                hola@gazette.cr
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
