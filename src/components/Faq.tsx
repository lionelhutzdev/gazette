const faqs = [
  {
    question: "¿Qué es La Gaceta?",
    answer:
      "Es el Diario Oficial de Costa Rica, donde el gobierno publica decretos, edictos, avisos legales y notificaciones judiciales. Sale todos los días hábiles y es de lectura obligatoria para muchos trámites legales, pero casi nadie la revisa completa.",
  },
  {
    question: "¿Qué tan rápido me avisan?",
    answer:
      "Procesamos la edición del día apenas se publica y te enviamos el email el mismo día hábil si hay un match con alguna de tus keywords.",
  },
  {
    question: "¿Puedo cambiar mis keywords?",
    answer:
      "Sí, cuando quieras. Podés tener hasta 3 keywords activas a la vez dentro del plan, y las reemplazás desde tu cuenta sin costo adicional.",
  },
];

export default function Faq() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 flex max-w-2xl flex-col divide-y divide-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg font-semibold text-ink">
                {faq.question}
                <span className="ml-4 font-mono text-ink/40 group-open:hidden">
                  +
                </span>
                <span className="ml-4 hidden font-mono text-ink/40 group-open:inline">
                  −
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
