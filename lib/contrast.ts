import { converter } from 'culori'

const toRgb = converter('rgb')

/** sRGB companding, per WCAG 2.1 relative luminance. */
function channel(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function luminance(color: string): number {
  const rgb = toRgb(color)
  if (!rgb) throw new Error(`Unparseable colour: ${color}`)
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
}

/** WCAG 2.1 contrast ratio, 1–21. Order of arguments does not matter. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Pulls the ink declarations out of CSS source so the palette tests assert
 * against the stylesheet that actually ships, not a copy that can drift.
 */
export function readPalette(css: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /(--(?:ink-[a-z]+|paper))\s*:\s*([^;]+);/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css))) out[m[1]] = m[2].trim()
  return out
}
