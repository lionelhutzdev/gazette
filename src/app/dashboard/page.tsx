import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { removeKeyword, signOut } from "@/app/dashboard/actions";
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
    .select("id, term, created_at")
    .order("created_at", { ascending: true });

  const activeCount = keywords?.length ?? 0;

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
                <span className="text-sm text-ink">{keyword.term}</span>
                <form action={removeKeyword.bind(null, keyword.id)}>
                  <button
                    type="submit"
                    className="text-sm text-ink/40 hover:text-accent"
                  >
                    Quitar
                  </button>
                </form>
              </li>
            ))}
          </ul>

          {activeCount === 0 && (
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
      </div>
    </main>
  );
}
