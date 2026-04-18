/**
 * Color conversion utilities.
 * Pure functions — no side effects, no DOM access.
 */

/** Convert a HEX color string to an { r, g, b } object (0-255). */
export function parseHex(hex: string): { r: number; g: number; b: number } | null {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

/** Normalise an { r, g, b } object back to a 6-digit HEX string. */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

/** Convert RGB (0-255) to HSL. */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** Convert an sRGB component (0-1) to linear sRGB. */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert sRGB (0-255) to OKLCH using the standard pipeline:
 * sRGB → linear sRGB → OKLab → OKLCH.
 */
export function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  const lr = srgbToLinear(r / 255);
  const lg = srgbToLinear(g / 255);
  const lb = srgbToLinear(b / 255);

  // Linear sRGB → LMS (Björn Ottosson's matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Cube-root
  const lCr = Math.cbrt(l_);
  const mCr = Math.cbrt(m_);
  const sCr = Math.cbrt(s_);

  // LMS → OKLab
  const L = 0.2104542553 * lCr + 0.7936177850 * mCr - 0.0040720468 * sCr;
  const a = 1.9779984951 * lCr - 2.4285922050 * mCr + 0.4505937099 * sCr;
  const bOk = 0.0259040371 * lCr + 0.7827717662 * mCr - 0.8086757660 * sCr;

  // OKLab → OKLCH
  const C = Math.sqrt(a * a + bOk * bOk);
  let H = Math.atan2(bOk, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return {
    l: +L.toFixed(3),
    c: +C.toFixed(3),
    h: Math.round(H),
  };
}

/** Convert a HEX colour to an rgba() CSS string. */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
