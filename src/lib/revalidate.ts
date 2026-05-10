// Revalidate cache after admin data changes
const REVALIDATE_SECRET = 'tripcngo-revalidate-2025';

export async function triggerRevalidate(type: string, paths?: string[]) {
  try {
    const baseUrl = window.location.origin;
    const res = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: REVALIDATE_SECRET, type, paths }),
    });
    const data = await res.json();
    console.log(`[Cache] Revalidated: ${type}`, data.paths?.length || 0, 'paths');
  } catch (e) {
    console.error('[Cache] Revalidate failed:', e);
  }
}
