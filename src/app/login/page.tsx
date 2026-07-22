"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Step = "email" | "code";
type Status = "idle" | "loading" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("idle");
    setStep("code");
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setStatus("error");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Ingresar a Gazette
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {step === "email"
            ? "Te mandamos un código a tu email, sin contraseña."
            : `Escribí el código que te llegó a ${email}.`}
        </p>

        {step === "email" ? (
          <form onSubmit={handleRequestCode} className="mt-8 flex flex-col gap-3">
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
              disabled={status === "loading"}
              className="bg-accent px-6 py-3 font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {status === "loading" ? "Enviando…" : "Enviar código"}
            </button>
            {status === "error" && (
              <p className="text-sm text-accent">
                Algo falló. Probá de nuevo en un rato.
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="mt-8 flex flex-col gap-3">
            <input
              type="text"
              inputMode="numeric"
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="123456"
              className="w-full border border-line bg-white px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-ink placeholder:tracking-normal placeholder:text-ink/40 outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-accent px-6 py-3 font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {status === "loading" ? "Verificando…" : "Entrar"}
            </button>
            {status === "error" && (
              <p className="text-sm text-accent">
                Código inválido o vencido. Probá de nuevo.
              </p>
            )}
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-sm text-ink/50 hover:text-accent"
            >
              Usar otro email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
