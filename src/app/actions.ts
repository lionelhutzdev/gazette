"use server";

import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { getSupabaseClient } from "@/lib/supabase";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

export type WaitlistState = {
  status: "idle" | "success" | "error" | "duplicate";
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const ip = clientIp(await headers());
  if (isRateLimited(`join-waitlist:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
    return { status: "error", message: "Demasiados intentos. Probá de nuevo en un rato." };
  }

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
    Sentry.captureException(error, {
      tags: { flow: "join_waitlist" },
      extra: { email, code: error.code },
    });
    return { status: "error", message: "Algo falló. Probá de nuevo en un rato." };
  }

  return { status: "success", message: "Listo. Te avisamos apenas lancemos." };
}
