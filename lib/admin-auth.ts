export const ADMIN_AUTH_KEY = 'kowa-admin-auth';
export const ADMIN_SOURCES_KEY = 'kowa-admin-sources';

export function getLocalAdminAuth(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'authenticated';
}

export function setLocalAdminAuth(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_AUTH_KEY, 'authenticated');
}

export function clearLocalAdminAuth(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_AUTH_KEY);
}

export function readLocalAdminSources<T>(): T[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(ADMIN_SOURCES_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalAdminSources<T>(sources: T[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_SOURCES_KEY, JSON.stringify(sources));
}
