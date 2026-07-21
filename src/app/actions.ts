"use server";

import { getSupabaseClient } from "@/lib/supabase";

export type WaitlistState = {
  status: "idle" | "success" | "error" | "duplicate";
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", message: "Ingresá un email válido." };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      status: "error",
      message: "El servicio no está configurado todavía. Intentá más tarde.",
    };
  }

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { status: "duplicate", message: "Ese email ya está en la lista." };
    }
    return { status: "error", message: "Algo falló. Probá de nuevo en un rato." };
  }

  return { status: "success", message: "Listo. Te avisamos apenas lancemos." };
}
