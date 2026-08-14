"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { addKeyword, type KeywordFormState } from "@/app/dashboard/actions";

const initialState: KeywordFormState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="whitespace-nowrap bg-accent px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
    >
      {pending ? "Agregando…" : "Agregar"}
    </button>
  );
}

export default function AddKeywordForm() {
  const [state, formAction] = useActionState(addKeyword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        name="term"
        required
        maxLength={200}
        placeholder="Nombre de empresa, persona o palabra clave"
        className="flex-1 border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-accent"
      />
      <SubmitButton />
      {state.status === "error" && (
        <p className="text-sm text-accent sm:self-center">{state.message}</p>
      )}
    </form>
  );
}
