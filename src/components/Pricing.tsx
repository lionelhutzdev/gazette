import WaitlistForm from "@/components/WaitlistForm";

const features = [
  "14 días de prueba gratis con 1 keyword",
  "Hasta 3 keywords activas en el plan pago",
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
          Un solo plan, sin letra chica. Probalo gratis 14 días antes de pagar.
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
            <a
              href="/login"
              className="block w-full bg-accent px-6 py-3 text-center font-medium text-paper transition-colors hover:bg-accent-dark"
            >
              Empezar prueba gratis
            </a>
            <p className="mt-3 mb-3 text-sm text-ink/60">
              14 días, 1 keyword, sin tarjeta. El pago todavía no está
              abierto — dejá tu email y te avisamos apenas puedas pasar al
              plan completo.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
