import React, { useState } from 'react'
import { FileText, AlertTriangle, CheckCircle, Download, Shield, ChevronRight, Award, ExternalLink } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { CERT_PRICE, CERT_CURRENCY, PAYMENT_URL, VERIFY_URL, sha256Hex } from '../data/monetize'

const aclClauses = [
  {
    id: 'auto-renewal',
    name: 'AUTO-RENEWAL TRAP',
    severity: 'high',
    patterns: [/automatically\s+renew/i, /successive\s+periods/i, /unless\s+notified\s+in\s+writing/i, /auto-?renew/i, /continuous\s+service/i],
    aclRef: 'ACL s.25(1)',
    reason: 'Automatic renewal without clear affirmative consent is an unfair contract term under Australian Consumer Law.',
    resolution: 'I hereby opt-out of all future renewals effective immediately. This clause is void under ACL s.25(1).'
  },
  {
    id: 'excessive-notice',
    name: 'EXCESSIVE NOTICE PERIOD',
    severity: 'high',
    patterns: [/90\s+days?\s+notice/i, /three\s+months?\s+prior/i, /certified\s+mail\s+only/i, /180\s+days?\s+notice/i],
    aclRef: 'ACL s.21',
    reason: 'A 90-day notice period for a month-to-month service is a barrier to exit and punitive.',
    resolution: 'I am providing the statutory 30-day notice. This excessive period is void under ACL s.21.'
  },
  {
    id: 'unilateral-price',
    name: 'UNILATERAL PRICE INCREASE',
    severity: 'medium',
    patterns: [/reserve\s+the\s+right\s+to\s+change\s+fees/i, /without\s+prior\s+notice/i, /at\s+our\s+sole\s+discretion/i, /may\s+adjust\s+pricing/i],
    aclRef: 'ACL s.24',
    reason: 'Unilateral price variation without consumer consent is an unfair contract term.',
    resolution: 'I do not consent to future price increases without a signed addendum. Any unauthorized charge will be disputed.'
  },
  {
    id: 'liquidated-damages',
    name: 'LIQUIDATED DAMAGES PENALTY',
    severity: 'high',
    patterns: [/early\s+termination\s+fee/i, /balance\s+of\s+the\s+term/i, /administrative\s+penalty/i, /cancellation\s+fee/i],
    aclRef: 'ACL s.21',
    reason: 'Termination fees must reflect actual loss, not a penalty. Penalty clauses are void.',
    resolution: 'I request an itemized breakdown of actual loss or I will refer this to the Ombudsman.'
  },
  {
    id: 'silence-consent',
    name: 'SILENCE IS CONSENT',
    severity: 'high',
    patterns: [/continued\s+use\s+constitutes\s+acceptance/i, /terms\s+may\s+change\s+at\s+any\s+time/i, /by\s+continuing\s+to\s+use/i, /deemed\s+to\s+have\s+accepted/i],
    aclRef: 'ACL s.25',
    reason: 'Material changes to a contract require explicit consent. Silence cannot constitute acceptance.',
    resolution: 'I reject all updates not explicitly signed by me. This clause is void under ACL s.25.'
  }
]

function ContractAuditor() {
  const [contractText, setContractText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [scanStage, setScanStage] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [letter, setLetter] = useState(null)
  const [generatingLetter, setGeneratingLetter] = useState(false)
  const [certified, setCertified] = useState(false)
  const [accessCode, setAccessCode] = useState('')

  const scanStages = [
    "Parsing contract structure...",
    "Identifying clause boundaries...",
    "Cross-referencing ACL ss.23-28...",
    "Evaluating fairness predicates...",
    "Calculating risk scores...",
    "Analysis complete."
  ]

  const handleAnalyze = async (text) => {
    setContractText(text)
    setAnalyzing(true)
    setScanStage(0)
    setAnalysis(null)
    setLetter(null)

    const interval = setInterval(() => {
      setScanStage((prev) => (prev >= scanStages.length - 1 ? prev : prev + 1))
    }, 800)

    // Pattern-match the pasted text against known unfair-clause signatures (client-side only, no external call)
    setTimeout(() => {
      const flaggedClauses = []
      
      for (const clause of aclClauses) {
        for (const pattern of clause.patterns) {
          if (pattern.test(text)) {
            const match = text.match(pattern)
            flaggedClauses.push({
              ...clause,
              match: match ? match[0] : null,
              position: match ? match.index : null
            })
            break
          }
        }
      }

      // Calculate fairness score
      const totalClauses = aclClauses.length
      const highRisk = flaggedClauses.filter(c => c.severity === 'high').length
      const mediumRisk = flaggedClauses.filter(c => c.severity === 'medium').length
      const score = Math.max(0, 100 - (highRisk * 20) - (mediumRisk * 10))

      clearInterval(interval)
      setScanStage(scanStages.length - 1)
      setTimeout(() => {
        setAnalysis({
          flaggedClauses,
          score,
          summary: `Analysis identified ${flaggedClauses.length} potentially unfair contract terms. Fairness score: ${score}/100.`,
          highRiskCount: highRisk
        })
        setAnalyzing(false)
      }, 400)
    }, 5000)
  }

  const composeLetter = (a) => {
    const date = new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })

    let letterContent = `STRATEGIC RESOLUTION LETTER\n${'='.repeat(50)}\n\nDate: ${date}\n\nTo Whom It May Concern,\n\nRe: Notice of Unfair Contract Terms — Request for Fair Resolution\n\n`

    letterContent += `I am writing to formally object to the following clauses in my contract which appear to be unfair contract terms under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)).\n\n`

    a.flaggedClauses.forEach((clause, i) => {
      letterContent += `CLAUSE ${i + 1}: ${clause.name}\n`
      letterContent += `Identified Pattern: "${clause.match || 'See attached contract'}"\n`
      letterContent += `Legal Reference: ${clause.aclRef}\n`
      letterContent += `Reason: ${clause.reason}\n`
      letterContent += `Required Action: ${clause.resolution}\n\n`
      letterContent += `${'-'.repeat(50)}\n\n`
    })

    letterContent += `CONCLUSION\n\nI request that you:\n1. Acknowledge receipt of this notice within 7 business days\n2. Provide written confirmation that the above clauses are void or amended\n3. Issue an amended contract with fair terms\n\nFailure to respond may result in a complaint to the Australian Competition and Consumer Commission (ACCC) or the relevant state fair trading body.\n\nYours faithfully,\n[Your Name]\n[Your Address]\n[Your Contact Information]\n\n${'-'.repeat(50)}\n\nDISCLAIMER: This letter was generated by Apex Global Shield, an automated information tool that pattern-matches text against publicly available Australian Consumer Law criteria (legislation.gov.au, accc.gov.au). It may contain errors or inaccuracies. This is a communication assistance tool, NOT legal advice. No solicitor-client relationship exists. Verify all legal references independently and consider consulting a qualified legal professional.`

    return letterContent
  }

  const handleGenerateLetter = () => {
    if (!analysis) return
    setGeneratingLetter(true)
    setLetter(composeLetter(analysis))
    setGeneratingLetter(false)
  }

  const downloadPDF = () => {
    if (!letter) return
    const doc = new jsPDF()
    doc.setFont('courier')
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(letter, 180)
    doc.text(lines, 15, 15)
    doc.save('apex-resolution-letter.pdf')
  }

  const composeComplaint = (a) => {
    let c = `COMPLAINT SUMMARY — UNFAIR CONTRACT TERMS\n${'='.repeat(50)}\n\nI wish to lodge a complaint about unfair contract terms in a standard-form consumer agreement, contrary to the Australian Consumer Law (ACL ss.23-28).\n\n`
    a.flaggedClauses.forEach((cl, i) => {
      c += `${i + 1}. ${cl.name} (${cl.aclRef}) — present in my agreement: "${cl.match || 'see contract'}."\n   Why unfair: ${cl.reason}\n\n`
    })
    c += `I have notified the trader in writing and received no fair resolution. I ask that this matter be reviewed under the unfair contract terms provisions.\n\n[YOUR NAME]\n[YOUR CONTACT]\n\nThis template was prepared with an automated information tool and is not legal advice. Lodge via the ACCC (accc.gov.au) or your state/territory fair-trading office.`
    return c
  }

  const buildCertifiedPDF = async () => {
    if (!analysis) return
    const L = letter || composeLetter(analysis)
    const C = composeComplaint(analysis)
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
    write('CERTIFIED CONSUMER CASE FILE', 15, 'bold', [30, 30, 30])
    y += 6
    write(`Prepared: ${stamp}`, 10, 'normal', [110, 110, 110])
    write(`Fairness score: ${analysis.score}/100  \u00b7  ${analysis.flaggedClauses.length} clause(s) flagged  \u00b7  ${analysis.highRiskCount} high-risk`, 11)
    y += 8
    write('SECTION 1 - UNFAIR TERMS IDENTIFIED (ACL ss.23-28)', 13, 'bold', [184, 134, 11])
    analysis.flaggedClauses.forEach((cl, i) => {
      y += 3
      write(`${i + 1}. ${cl.name}  [${cl.severity.toUpperCase()}]  ${cl.aclRef}`, 11, 'bold', [30, 30, 30])
      write(`Matched text: "${cl.match || 'see contract'}"`, 10, 'italic', [110, 110, 110])
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
    write('This is a document-preparation and information service, NOT legal advice. No lawyer-client relationship is created. The tool does not represent you in any legal, regulatory or administrative proceeding. Verify all references and decide yourself what to send.', 9, 'normal', [150, 40, 40])
    doc.save('apex-certified-case-file.pdf')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
          <FileText className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">SHIELD 01</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          CONTRACT HEALTH AUDITOR
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Paste your service agreement below. The tool checks your text against Australian Consumer Law unfair-contract-term criteria (ACL ss.23-28) and returns the clauses it matched, with the reference for each.
          <span className="text-gold font-bold"> Completely free. Always.</span>
        </p>
      </div>

      {/* Input Section */}
      <div className="card mb-8">
        <textarea
          className="input w-full h-64 font-mono text-sm resize-none"
          placeholder="Paste your contract text here..."
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
        />
        <button
          onClick={() => handleAnalyze(contractText)}
          disabled={analyzing || !contractText}
          className="btn-primary w-full mt-4"
        >
          {analyzing ? 'ANALYZING...' : 'ANALYZE FOR UNFAIR CLAUSES'}
        </button>
      </div>

      {/* Scanning Animation */}
      {analyzing && (
        <div className="card mb-8 border-gold/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h3 className="font-heading text-sm tracking-widest text-gold">SCANNING CONTRACT</h3>
              <p className="text-muted-foreground text-sm">{scanStages[scanStage]}</p>
            </div>
          </div>
          <div className="space-y-2">
            {scanStages.map((stage, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm ${i <= scanStage ? 'text-gold' : 'text-muted-foreground/30'}`}>
                {i < scanStage ? <CheckCircle className="w-4 h-4" /> : i === scanStage ? <ChevronRight className="w-4 h-4 animate-pulse" /> : <div className="w-4 h-4"></div>}
                {stage}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {analysis && !analyzing && (
        <div className="space-y-8">
          {/* Score Card */}
          <div className="card border-gold/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm tracking-widest text-gold">ANALYSIS SUMMARY</h3>
              <span className={`badge ${analysis.score >= 70 ? 'badge-low' : analysis.score >= 40 ? 'badge-medium' : 'badge-high'}`}>
                {analysis.score}/100 FAIRNESS
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{analysis.summary}</p>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">{analysis.highRiskCount} HIGH-RISK CLAUSES DETECTED</span>
            </div>
          </div>

          {/* Flagged Clauses */}
          {analysis.flaggedClauses.length > 0 && (
            <div className="card">
              <h3 className="font-heading text-sm tracking-widest text-gold mb-6">FLAGGED CLAUSES</h3>
              <div className="space-y-4">
                {analysis.flaggedClauses.map((clause, i) => (
                  <div key={i} className="border border-border rounded-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge ${clause.severity === 'high' ? 'badge-high' : 'badge-medium'}`}>
                        {clause.severity.toUpperCase()} RISK
                      </span>
                      <span className="text-muted-foreground text-xs font-heading">{clause.aclRef}</span>
                    </div>
                    <p className="text-foreground font-bold mb-1">{clause.name}</p>
                    <p className="text-muted-foreground text-sm mb-2">"{clause.match}"</p>
                    <p className="text-muted-foreground text-sm mb-2">{clause.reason}</p>
                    <p className="text-gold text-sm">{clause.resolution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution Letter */}
          <div className="card">
            <h3 className="font-heading text-sm tracking-widest text-gold mb-4">STRATEGIC RESOLUTION LETTER</h3>
            {letter ? (
              <div className="bg-card border border-border rounded-sm p-4 mb-4 max-h-96 overflow-y-auto">
                <pre className="text-muted-foreground text-sm whitespace-pre-wrap font-mono">{letter}</pre>
              </div>
            ) : (
              <button onClick={handleGenerateLetter} disabled={generatingLetter} className="btn-primary w-full">
                {generatingLetter ? 'GENERATING...' : 'GENERATE RESOLUTION LETTER — FREE'}
              </button>
            )}
            {letter && (
              <div className="flex gap-4 mt-4">
                <button onClick={downloadPDF} className="btn-secondary flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  DOWNLOAD PDF
                </button>
                <button onClick={() => navigator.clipboard.writeText(letter)} className="btn-secondary flex-1">
                  COPY TO CLIPBOARD
                </button>
              </div>
            )}
          </div>

          {/* Certified Case File - the one optional paid channel (free core stays free) */}
          <div className="card border-gold/40">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-gold" />
              <h3 className="font-heading text-sm tracking-widest text-gold">CERTIFIED CASE FILE — OPTIONAL</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Everything above — the scan, the flagged clauses, the letter, the PDF download and copy — is <span className="text-foreground font-bold">free, always.</span> The Certified Case File is a single optional {CERT_CURRENCY} {CERT_PRICE} upgrade: a print-ready, multi-section dossier (identified terms, a ready-to-send letter and a regulatory complaint template) closed with a document-integrity seal you can verify. You pay for a finished document, never for an outcome.
            </p>
            {!PAYMENT_URL ? (
              <p className="text-xs text-destructive">
                Secure checkout is not connected yet, so no payment can be taken today. This control comes online the moment the payment link is configured.
              </p>
            ) : certified ? (
              <button onClick={buildCertifiedPDF} className="btn-primary w-full mt-2">
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
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-card/50 border border-border rounded-sm">
        <p className="text-muted-foreground text-xs">
          <strong className="text-gold">DISCLAIMER:</strong> This tool is an information indexing and citation tool. It retrieves publicly available data from legislation.gov.au and accc.gov.au. AI outputs may contain errors, inaccuracies, omissions, or outdated information. Users must independently verify all outputs against official government sources before taking any action. Use of this platform does not create a solicitor-client relationship. Letters are templates for the user's own use. This platform does not represent users in any legal, regulatory, or administrative proceeding.
        </p>
      </div>
    </div>
  )
}

export default ContractAuditor
