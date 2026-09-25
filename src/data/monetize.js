// Apex Global Shield — the ONE revenue channel (EMPIRE_STATE §22, §8 mandate).
//
// DOCTRINE: every scanner, report, letter, PDF download and copy on this site is
// FREE forever (free core, viral trust, one-shot-then-silence). The single optional
// paid item is the "Certified Case File" — a sealed, print-ready dossier.
// Money buys PROCESS (a finished, integrity-sealed document), never an OUTCOME.
// The previously-noted "10% success fee" is DROPPED: it prices the outcome, which
// breaches the 21-Aug extortion-line lock ("pay-to-unflag REJECTED as extortion")
// and cannot be self-served or verified at world scale.

export const CERT_PRICE = 19
export const CERT_CURRENCY = 'AUD'

// Master's product link (Stripe Payment Link / Gumroad / Lemon Squeezy).
// Leave empty until it is created: with no link the buy control stays honestly
// disabled and NO payment can be taken — we never ship a fake purchase button.
export const PAYMENT_URL = ''

// Public surface used to verify the document-integrity seal.
export const VERIFY_URL = 'https://apex-infrastructure.com'

// SHA-256 (hex) via the browser Web Crypto API — a real content hash, not theatre.
export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
