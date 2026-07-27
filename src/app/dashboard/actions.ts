"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { normalize } from "@/lib/matching";

const MAX_ACTIVE_KEYWORDS = 3;
const MAX_TERM_LENGTH = 200;

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

  if (term.length > MAX_TERM_LENGTH) {
    return {
      status: "error",
      message: `La keyword no puede tener más de ${MAX_TERM_LENGTH} caracteres.`,
    };
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { status: "error", message: "Tu sesión expiró. Volvé a ingresar." };
  }

  const { data: existingKeywords } = await supabase
    .from("keywords")
    .select("term")
    .eq("user_id", user.id);

  const normalizedTerm = normalize(term);
  const isDuplicate = (existingKeywords ?? []).some(
    (keyword) => normalize(keyword.term) === normalizedTerm
  );

  if (isDuplicate) {
    return { status: "error", message: "Ya tenés esa keyword agregada." };
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
    console.error("No se pudo insertar la keyword", error);
    return { status: "error", message: "No se pudo guardar la keyword." };
  }

  revalidatePath("/dashboard");
  return { status: "idle", message: "" };
}

export async function updateKeyword(
  keywordId: string,
  term: string
): Promise<KeywordFormState> {
  const trimmed = term.trim();

  if (!trimmed) {
    return { status: "error", message: "Escribí una keyword." };
  }

  if (trimmed.length > MAX_TERM_LENGTH) {
    return {
      status: "error",
      message: `La keyword no puede tener más de ${MAX_TERM_LENGTH} caracteres.`,
    };
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Tu sesión expiró. Volvé a ingresar." };
  }

  const { data: existingKeywords } = await supabase
    .from("keywords")
    .select("id, term")
    .eq("user_id", user.id);

  const normalizedTerm = normalize(trimmed);
  const isDuplicate = (existingKeywords ?? []).some(
    (keyword) => keyword.id !== keywordId && normalize(keyword.term) === normalizedTerm
  );

  if (isDuplicate) {
    return { status: "error", message: "Ya tenés esa keyword agregada." };
  }

  const { error } = await supabase
    .from("keywords")
    .update({ term: trimmed })
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) {
    console.error("No se pudo actualizar la keyword", error);
    return { status: "error", message: "No se pudo actualizar la keyword." };
  }

  revalidatePath("/dashboard");
  return { status: "idle", message: "" };
}

export async function removeKeyword(keywordId: string) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("keywords")
    .delete()
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) {
    console.error("No se pudo borrar la keyword", error);
  }

  revalidatePath("/dashboard");
}

export async function setKeywordActive(keywordId: string, active: boolean) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (active) {
    const { count } = await supabase
      .from("keywords")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("active", true);

    if ((count ?? 0) >= MAX_ACTIVE_KEYWORDS) return;
  }

  const { error } = await supabase
    .from("keywords")
    .update({ active })
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) {
    console.error("No se pudo cambiar el estado de la keyword", error);
  }

  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/dashboard");
}
