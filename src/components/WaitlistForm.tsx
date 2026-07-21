"use client";

import { useFormState, useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

const initialState: WaitlistState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="whitespace-nowrap bg-accent px-6 py-3 font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Avisame cuando lance"}
    </button>
  );
}

export default function WaitlistForm() {
  const [state, formAction] = useFormState(joinWaitlist, initialState);

  if (state.status === "success" || state.status === "duplicate") {
    return (
      <p className="border border-line bg-white px-4 py-3 text-sm text-ink">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@empresa.com"
          className="w-full border border-line bg-white px-4 py-3 text-ink placeholder:text-ink/40 outline-none focus:border-accent"
        />
        {state.status === "error" && (
          <p className="mt-1 text-sm text-accent">{state.message}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
