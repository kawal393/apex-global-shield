import React, { useState } from 'react'
import { Award, Download, ExternalLink } from 'lucide-react'
import { CERT_PRICE, CERT_CURRENCY, PAYMENT_URL, buildCertifiedFilePDF } from '../lib/casefile'

// One shared "Certified Case File" control for every text-scanning shield.
// Renders ONLY when an analysis exists. The free core is untouched; this is the
// single optional paid item. With no PAYMENT_URL configured the control is shown
// honestly disabled — we never render a fake purchase button that takes money.
function CertifiedCaseFile({ analysis, meta }) {
  const [certified, setCertified] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  if (!analysis || analysis.flagged.length === 0) return null

  return (
    <div className="card border-gold/40">
      <div className="flex items-center gap-2 mb-2">
        <Award className="w-5 h-5 text-gold" />
        <h3 className="font-heading text-sm tracking-widest text-gold">CERTIFIED CASE FILE — OPTIONAL</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-4">
        Everything above — the scan, the flagged clauses and the letter — is <span className="text-foreground font-bold">free, always.</span> The Certified Case File is a single optional {CERT_CURRENCY} {CERT_PRICE} upgrade: a print-ready, multi-section dossier (identified terms, a ready-to-send letter and a regulatory complaint template) closed with a document-integrity seal you can verify. You pay for a finished document, never for an outcome.
      </p>
      {!PAYMENT_URL ? (
        <p className="text-xs text-destructive">
          Secure checkout is not connected yet, so no payment can be taken today. This control comes online the moment the payment link is configured.
        </p>
      ) : certified ? (
        <button onClick={() => buildCertifiedFilePDF(analysis, meta)} className="btn-primary w-full mt-2">
          <Download className="w-4 h-4 mr-2" />
          DOWNLOAD CERTIFIED CASE FILE
        </button>
      ) : (
        <div className="space-y-3 mt-2">
          <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full inline-flex items-center justify-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            GET CERTIFIED CASE FILE — {CERT_PRICE} {CERT_CURRENCY}
          </a>
          <div className="flex gap-2">
            <input
              className="input flex-1 text-sm"
              placeholder="Enter the access code from your receipt"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            <button onClick={() => { if (accessCode.trim().length >= 4) setCertified(true) }} className="btn-secondary">
              UNLOCK
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Paying buys the prepared, sealed document only. It does not guarantee any result with the company or any regulator.</p>
        </div>
      )}
    </div>
  )
}

export default CertifiedCaseFile
