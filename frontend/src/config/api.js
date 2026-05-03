/** Backend root URL from env (Railway/Vercel), e.g. https://your-app.up.railway.app */
export const BASE_URL = import.meta.env.VITE_API_URL;

const origin =
  BASE_URL !== undefined && BASE_URL !== null && String(BASE_URL).trim() !== ''
    ? String(BASE_URL).trim().replace(/\/+$/, '')
    : '';

/** Axios base path: /<root>/api/v1 */
export const API_BASE_URL = origin ? `${origin}/api/v1` : '';
