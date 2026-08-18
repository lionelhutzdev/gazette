import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

// Corre contra producción (no hay staging Supabase todavía). Necesita
// NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno donde
// se ejecuta — no viven en .env.local del entorno "development" de Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// El sender de Supabase SMTP sigue siendo onboarding@resend.dev (dominio
// sandbox de Resend), que solo entrega a la dirección con la que te
// registraste en Resend. Hasta que se verifique un dominio propio, el test
// tiene que usar esa misma dirección — cualquier otro destinatario rebota
// con 403. Por eso NO se borra el usuario al final: es la cuenta real del
// dueño del proyecto, no un usuario descartable.
const email = process.env.E2E_LOGIN_EMAIL ?? "lionelhutzdev@gmail.com";

test("login end-to-end: pedir código, verificarlo, llegar al dashboard", async ({ page }) => {
  test.skip(
    !supabaseUrl || !serviceRoleKey,
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno"
  );

  const admin = createClient(supabaseUrl!, serviceRoleKey!);

  // 1. Ejercita el flujo real: nuestra route /api/auth/request-otp llama a
  // Supabase, que manda el email vía Resend. Esto es exactamente lo que se
  // rompió en producción — si el SMTP o la route fallan, el test falla acá.
  await page.goto("/login");
  await page.getByPlaceholder("tu@empresa.com").fill(email);
  await page.getByRole("button", { name: "Enviar código" }).click();
  await expect(page.getByPlaceholder("123456")).toBeVisible({ timeout: 15_000 });

  // 2. No leemos el inbox real: generamos un código válido por admin API.
  // Esto invalida el código que se acaba de mandar por email, pero ya
  // probamos que el envío en sí funcionó en el paso anterior.
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  expect(linkError).toBeNull();
  const otp = linkData?.properties?.email_otp;
  expect(otp).toBeTruthy();

  // 3. Completa el login como lo haría un usuario real.
  await page.getByPlaceholder("123456").fill(otp!);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  await expect(page.getByText(email)).toBeVisible();
});
