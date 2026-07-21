const points = [
  {
    title: "Te enterás tarde",
    description:
      "Un embargo, una demanda o un cambio societario puede estar publicado hace semanas antes de que alguien de tu equipo se entere por casualidad.",
  },
  {
    title: "Revisar La Gaceta a mano es tedioso",
    description:
      "Son decenas de páginas de PDF por edición, todos los días hábiles. Nadie en el equipo tiene tiempo de leerlas completas.",
  },
  {
    title: "Un abogado cobra por esto",
    description:
      "Contratar a alguien para que revise publicaciones oficiales manualmente cuesta más al mes de lo que cuesta automatizarlo.",
  },
];

export default function Pain() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Hoy, sin esto
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="border-l-2 border-line pl-5">
              <h3 className="font-serif text-lg font-semibold text-ink">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
