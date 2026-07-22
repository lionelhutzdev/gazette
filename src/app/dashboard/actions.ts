"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const MAX_ACTIVE_KEYWORDS = 3;

export type KeywordFormState = {
  status: "idle" | "error";
  message: string;
};

export async function addKeyword(
  _prevState: KeywordFormState,
  formData: FormData
): Promise<KeywordFormState> {
  const term = String(formData.get("term") ?? "").trim();

  if (!term) {
    return { status: "error", message: "Escribí una keyword." };
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { status: "error", message: "Tu sesión expiró. Volvé a ingresar." };
  }

  const { count } = await supabase
    .from("keywords")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("active", true);

  if ((count ?? 0) >= MAX_ACTIVE_KEYWORDS) {
    return {
      status: "error",
      message: `Ya tenés ${MAX_ACTIVE_KEYWORDS} keywords activas, el máximo del plan.`,
    };
  }

  const { error } = await supabase.from("keywords").insert({
    user_id: user.id,
    email: user.email,
    term,
  });

  if (error) {
    return { status: "error", message: "No se pudo guardar la keyword." };
  }

  revalidatePath("/dashboard");
  return { status: "idle", message: "" };
}

export async function removeKeyword(keywordId: string) {
  const supabase = await getSupabaseServerClient();
  await supabase.from("keywords").delete().eq("id", keywordId);
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/dashboard");
}
