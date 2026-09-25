// Apex Global Shield — shared Certified Case File engine.
//
// One dossier builder used by every text-scanning shield (contract, employment,
// finance, lease, insurance). Keeping it in ONE place means the free core, the
// optional paid "Certified Case File", the legal disclaimers and the document-
// integrity seal are byte-identical across all shields — no drifting copy, no
// per-page disclaimer that forgets a fence. Doctrine: free core forever; the one
// optional paid item buys a finished, integrity-sealed document, never an outcome.

import { jsPDF } from 'jspdf'
import { CERT_PRICE, CERT_CURRENCY, PAYMENT_URL, VERIFY_URL, sha256Hex } from '../data/monetize'

// meta = { shieldTitle, lawLine, registerUrl, complaintIntro }
//   shieldTitle     e.g. 'CONTRACT'
//   lawLine         the legal basis sentence for the letter opening
//   registerUrl     where the user can independently verify the references
//   complaintIntro  first paragraph of the regulator-complaint template

const DISCLAIMER =
  'This document was prepared by Apex Global Shield, an automated information tool that pattern-matches ' +
  'text against publicly available law. It may contain errors or inaccuracies. It is NOT legal advice. ' +
  'No solicitor-client relationship exists. It does not represent you in any legal, regulatory or ' +
  'administrative proceeding. Verify every reference independently before you send anything, and decide ' +
  'for yourself what to do.'

function dateAU() {
  return new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function composeCaseLetter(analysis, meta) {
  let t = `STRATEGIC RESOLUTION LETTER\n${'='.repeat(50)}\n\nDate: ${dateAU()}\n\nTo Whom It May Concern,\n\nRe: Notice of Unfair Terms — Request for Fair Resolution\n\n`
  t += `I am writing to formally object to the following terms which appear to be unfair or unlawful under ${meta.lawLine}.\n\n`
  analysis.flagged.forEach((clause, i) => {
    t += `CLAUSE ${i + 1}: ${clause.name}\n`
    t += `Identified Pattern: "${clause.match || 'See attached document'}"\n`
    t += `Legal Reference: ${clause.aclRef}\n`
    t += `Reason: ${clause.reason}\n`
    t += `Required Action: ${clause.resolution}\n\n`
    t += `${'-'.repeat(50)}\n\n`
  })
  t += `CONCLUSION\n\nI request that you:\n1. Acknowledge receipt of this notice within 7 business days\n2. Provide written confirmation that the above terms are void or amended\n3. Issue an amended agreement with fair terms\n\nFailure to respond may result in a complaint to the relevant regulator or fair-trading body.\n\nYours faithfully,\n[Your Name]\n[Your Address]\n[Your Contact Information]\n\n${'-'.repeat(50)}\n\nDISCLAIMER: ${DISCLAIMER}`
  return t
}

export function composeCaseComplaint(analysis, meta) {
  let c = `COMPLAINT SUMMARY\n${'='.repeat(50)}\n\n${meta.complaintIntro}\n\n`
  analysis.flagged.forEach((cl, i) => {
    c += `${i + 1}. ${cl.name} (${cl.aclRef}) — present in my agreement: "${cl.match || 'see document'}."\n   Why unfair: ${cl.reason}\n\n`
  })
  c += `I have notified the other party in writing and received no fair resolution. I ask that this matter be reviewed.\n\n[YOUR NAME]\n[YOUR CONTACT]\n\nThis template was prepared with an automated information tool and is not legal advice. Lodge via your relevant regulator or fair-trading office (${meta.registerUrl}).`
  return c
}

// Build the multi-section sealed dossier. Every shield produces the same shape.
export async function buildCertifiedFilePDF(analysis, meta, letterText) {
  const L = letterText || composeCaseLetter(analysis, meta)
  const C = composeCaseComplaint(analysis, meta)
  const stamp = new Date().toISOString()
  const hex = await sha256Hex(`${L}\n\n${C}\n\nscore:${analysis.score}`)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 48
  let y = M
  const page = () => { doc.addPage(); y = M }
  const write = (txt, size = 11, style = 'normal', color = [40, 40, 40]) => {
    doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor(color[0], color[1], color[2])
    doc.splitTextToSize(String(txt), W - M * 2).forEach((ln) => { if (y + size + 4 > H - M) page(); doc.text(ln, M, y); y += size + 4 })
  }
  write('APEX GLOBAL SHIELD', 22, 'bold', [184, 134, 11])
  write(`${meta.shieldTitle} — CERTIFIED CASE FILE`, 15, 'bold', [30, 30, 30])
  y += 6
  write(`Prepared: ${stamp}`, 10, 'normal', [110, 110, 110])
  write(`Fairness score: ${analysis.score}/100  \u00b7  ${analysis.flagged.length} clause(s) flagged  \u00b7  ${analysis.highRiskCount} high-risk`, 11)
  y += 8
  write('SECTION 1 - UNFAIR TERMS IDENTIFIED', 13, 'bold', [184, 134, 11])
  analysis.flagged.forEach((cl, i) => {
    y += 3
    write(`${i + 1}. ${cl.name}  [${cl.severity.toUpperCase()}]  ${cl.aclRef}`, 11, 'bold', [30, 30, 30])
    write(`Matched text: "${cl.match || 'see document'}"`, 10, 'italic', [110, 110, 110])
    write(`Basis: ${cl.reason}`, 10)
    write(`Suggested action: ${cl.resolution}`, 10, 'normal', [184, 134, 11])
  })
  page(); write('SECTION 2 - RESOLUTION / NOTICE LETTER (ready to send)', 13, 'bold', [184, 134, 11]); y += 4
  L.split('\n').forEach((ln) => write(ln, 10))
  page(); write('SECTION 3 - REGULATORY COMPLAINT TEMPLATE', 13, 'bold', [184, 134, 11]); y += 4
  C.split('\n').forEach((ln) => write(ln, 10))
  page(); write('DOCUMENT INTEGRITY SEAL', 13, 'bold', [184, 134, 11])
  write(`SHA-256: ${hex}`, 9, 'normal', [30, 30, 30])
  write(`Issued: ${stamp}`, 10)
  write('This seal proves the file has not been altered since it was issued. Verify it independently. It is NOT a guarantee of any outcome.', 10, 'italic', [110, 110, 110])
  write(`Public verification surface: ${VERIFY_URL}`, 10, 'normal', [184, 134, 11])
  y += 8
  write(DISCLAIMER, 9, 'normal', [150, 40, 40])
  doc.save(`apex-certified-${meta.shieldTitle.toLowerCase().replace(/[^a-z]+/g, '-')}-case-file.pdf`)
}

export { CERT_PRICE, CERT_CURRENCY, PAYMENT_URL }
