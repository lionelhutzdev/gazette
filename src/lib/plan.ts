// Cuentas creadas antes de este corte quedan con las reglas viejas (3
// keywords, sin trial) — así no afecta a nadie que ya estaba usando el
// producto cuando se introdujo el trial.
export const TRIAL_CUTOFF = "2026-08-19T00:00:00.000Z";
export const TRIAL_DAYS = 14;
export const TRIAL_MAX_KEYWORDS = 1;
export const LEGACY_MAX_KEYWORDS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isTrialAccount(createdAt: string): boolean {
  return new Date(createdAt) >= new Date(TRIAL_CUTOFF);
}

export function getMaxActiveKeywords(createdAt: string): number {
  return isTrialAccount(createdAt) ? TRIAL_MAX_KEYWORDS : LEGACY_MAX_KEYWORDS;
}

export function getTrialDaysLeft(createdAt: string): number {
  const trialEnd = new Date(createdAt).getTime() + TRIAL_DAYS * DAY_MS;
  return Math.ceil((trialEnd - Date.now()) / DAY_MS);
}

export function isTrialExpired(createdAt: string): boolean {
  return isTrialAccount(createdAt) && getTrialDaysLeft(createdAt) <= 0;
}
