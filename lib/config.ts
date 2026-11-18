function positiveInt(value: string | undefined, fallback: number, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}
function nonNegativeNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && String(value || '').trim() !== '' ? parsed : fallback;
}

export const config = {
  localAuth: process.env.LOCAL_DEV_AUTH === 'true' && process.env.NODE_ENV !== 'production' && !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY),
  maxUploadBytes: positiveInt(process.env.DOCUMENT_MAX_UPLOAD_BYTES, 10 * 1024 * 1024, 10 * 1024 * 1024),
  maxPages: positiveInt(process.env.DOCUMENT_MAX_PAGES, 30, 30),
  bucket: process.env.SUPABASE_DOCUMENT_BUCKET || 'startinde-private-documents',
  dailyUploadLimit: positiveInt(process.env.DOCUMENT_DAILY_USER_LIMIT, 5),
  monthlyUploadLimit: positiveInt(process.env.DOCUMENT_MONTHLY_USER_LIMIT, 30),
  maxEstimatedCostUsd: nonNegativeNumber(process.env.DOCUMENT_MAX_ESTIMATED_COST_USD, 0.1),
  hasSupabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY),
};
