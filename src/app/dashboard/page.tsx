import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { removeKeyword, setKeywordActive, signOut } from "@/app/dashboard/actions";
import AddKeywordForm from "@/components/AddKeywordForm";

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: keywords } = await supabase
    .from("keywords")
    .select("id, term, active, created_at")
    .order("created_at", { ascending: true });

  const { data: matches } = await supabase
    .from("matches")
    .select("id, section, snippet, edition_date, document_id, keywords(term)")
    .order("edition_date", { ascending: false })
    .limit(20);

  const activeCount = keywords?.filter((keyword) => keyword.active).length ?? 0;

  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              Tus keywords
            </h1>
            <p className="mt-1 text-sm text-ink/60">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-ink/50 underline-offset-4 hover:text-accent hover:underline"
            >
              Salir
            </button>
          </form>
        </div>

        <div className="mt-10 border border-line bg-white p-6">
          <p className="text-sm text-ink/60">
            {activeCount} de 3 keywords activas
          </p>

          <ul className="mt-4 flex flex-col divide-y divide-line">
            {keywords?.map((keyword) => (
              <li
                key={keyword.id}
                className="flex items-center justify-between py-3"
              >
                <span
                  className={`text-sm ${keyword.active ? "text-ink" : "text-ink/40"}`}
                >
                  {keyword.term}
                  {!keyword.active && " (pausada)"}
                </span>
                <div className="flex items-center gap-3">
                  <form action={setKeywordActive.bind(null, keyword.id, !keyword.active)}>
                    <button
                      type="submit"
                      className="text-sm text-ink/40 hover:text-accent"
                    >
                      {keyword.active ? "Pausar" : "Reactivar"}
                    </button>
                  </form>
                  <form action={removeKeyword.bind(null, keyword.id)}>
                    <button
                      type="submit"
                      className="text-sm text-ink/40 hover:text-accent"
                    >
                      Quitar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>

          {activeCount === 0 && (keywords?.length ?? 0) === 0 && (
            <p className="py-3 text-sm text-ink/40">
              Todavía no configuraste ninguna keyword.
            </p>
          )}

          {activeCount < 3 && (
            <div className="mt-6 border-t border-line pt-6">
              <AddKeywordForm />
            </div>
          )}
        </div>

        <div className="mt-10 border border-line bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Últimas coincidencias
          </h2>

          {(!matches || matches.length === 0) && (
            <p className="mt-3 text-sm text-ink/40">
              Todavía no encontramos coincidencias para tus keywords.
            </p>
          )}

          <ul className="mt-4 flex flex-col divide-y divide-line">
            {matches?.map((match) => (
              <li key={match.id} className="py-3">
                <p className="text-sm font-medium text-ink">
                  {(match.keywords as unknown as { term: string } | null)?.term ?? "—"}
                  <span className="ml-2 text-xs text-ink/40">
                    {match.edition_date} · {match.section}
                  </span>
                </p>
                <p className="mt-1 text-sm text-ink/60">{match.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
