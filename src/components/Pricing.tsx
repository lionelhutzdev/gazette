import WaitlistForm from "@/components/WaitlistForm";

const features = [
  "Hasta 3 keywords activas",
  "Revisión de La Gaceta cada día hábil",
  "Aviso por email el mismo día del match",
  "Cambiás tus keywords cuando querés",
  "Cancelás cuando querés, sin permanencia",
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="font-serif text-2xl font-semibold text-ink">Precio</h2>
        <p className="mt-2 text-sm text-ink/60">
          Un solo plan. Sin trial gratis engañoso, sin letra chica.
        </p>

        <div className="mt-10 max-w-md border border-line bg-white p-8">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl font-semibold text-ink">
              $29
            </span>
            <span className="text-ink/50">/ mes</span>
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-ink/75"
              >
                <span className="mt-1 font-mono text-accent">·</span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            <p className="mb-3 text-sm text-ink/60">
              Todavía no está abierto el pago. Dejá tu email y te avisamos
              apenas lancemos.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
