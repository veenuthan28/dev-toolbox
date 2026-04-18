/**
 * Minimal HTML entity escaper — used to safely render user-provided
 * text inside innerHTML without XSS risk.
 */
export function escapeHtml(str: string): string {
  const el = document.createElement('div');
  el.textContent = str;
  return el.innerHTML;
}
