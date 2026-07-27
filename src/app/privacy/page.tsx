export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-ink/60">Última actualización: julio 2026.</p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-ink/80">
          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Qué datos guardamos
            </h2>
            <p className="mt-2">
              Si te anotás en la lista de espera, guardamos tu email. Si creás una
              cuenta, guardamos tu email y las keywords que configurás para monitorear
              en La Gaceta, junto con las coincidencias que se encuentran y las fechas
              en que se te notificó cada una.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Para qué los usamos
            </h2>
            <p className="mt-2">
              Únicamente para operar el servicio: autenticarte, buscar tus keywords en
              cada edición de La Gaceta, y enviarte un email cuando aparece una
              coincidencia. No vendemos ni compartimos tus datos con terceros para
              publicidad.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Sobre las keywords que monitoreás
            </h2>
            <p className="mt-2">
              Las keywords que configurás suelen ser el nombre de otra persona o
              empresa, no el tuyo — por ejemplo un socio, un cliente o un
              competidor. La Gaceta es un registro público: Gazette no publica
              nada nuevo, solo indexa y te avisa sobre contenido que el Estado
              ya hizo público. Vos sos responsable de usar el servicio con una
              finalidad legítima (debida diligencia, gestión de riesgo,
              seguimiento de un trámite propio) y no para acosar, discriminar o
              vigilar indebidamente a la persona que monitoreás. Los
              fragmentos de texto que coinciden con tu keyword se guardan como
              parte del historial de tu cuenta, con las mismas reglas de
              retención y borrado que el resto de tus datos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Con quién los compartimos
            </h2>
            <p className="mt-2">
              Usamos proveedores externos para operar Gazette: Supabase (base de datos
              y autenticación), Resend (envío de emails) y Vercel (hosting). Cada uno
              procesa tus datos solo para prestar ese servicio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Cuánto tiempo los guardamos
            </h2>
            <p className="mt-2">
              Mientras tu cuenta esté activa. Podés borrar una keyword y su historial
              de coincidencias vos mismo desde el dashboard, o pedirnos que borremos tu
              cuenta por completo.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-semibold text-ink">
              Tus opciones
            </h2>
            <p className="mt-2">
              Podés pausar o borrar tus keywords desde el dashboard en cualquier
              momento, o hacer click en el link de &ldquo;cancelar esta keyword&rdquo; al final de
              cualquier email de alerta. Para pedir la eliminación de tu cuenta o de tu
              email de la lista de espera, escribinos a{" "}
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
