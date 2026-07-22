"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Ingresar a Gazette
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Te mandamos un link mágico a tu email, sin contraseña.
        </p>

        {status === "sent" ? (
          <p className="mt-8 border border-line bg-white px-4 py-3 text-sm text-ink">
            Listo. Revisá tu email y hacé click en el link para entrar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@empresa.com"
              className="w-full border border-line bg-white px-4 py-3 text-ink placeholder:text-ink/40 outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-accent px-6 py-3 font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {status === "sending" ? "Enviando…" : "Enviar link mágico"}
            </button>
            {status === "error" && (
              <p className="text-sm text-accent">
                Algo falló. Probá de nuevo en un rato.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
