const steps = [
  {
    number: "01",
    title: "Configurás tus keywords",
    description:
      "Nombre de tu empresa, competidores, socios, tu propio nombre. Hasta 3 términos por cuenta.",
  },
  {
    number: "02",
    title: "Revisamos La Gaceta cada mañana",
    description:
      "Todos los días hábiles procesamos la edición completa del Diario Oficial en busca de tus términos.",
  },
  {
    number: "03",
    title: "Te avisamos por email si hay match",
    description:
      "Recibís el fragmento exacto, la fecha y el número de edición. Si no hay novedades, no recibís nada.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Cómo funciona
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="font-mono text-sm text-accent">
                {step.number}
              </span>
              <h3 className="mt-2 font-serif text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
