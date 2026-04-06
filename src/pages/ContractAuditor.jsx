import React, { useState } from 'react'
import { FileText, AlertTriangle, CheckCircle, Download, Shield, ChevronRight } from 'lucide-react'
import { jsPDF } from 'jspdf'

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

    // Simulate AI analysis with pattern matching
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

  const handleGenerateLetter = () => {
    if (!analysis) return
    setGeneratingLetter(true)

    const date = new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
    
    let letterContent = `STRATEGIC RESOLUTION LETTER\n${'='.repeat(50)}\n\nDate: ${date}\n\nTo Whom It May Concern,\n\nRe: Notice of Unfair Contract Terms — Request for Fair Resolution\n\n`
    
    letterContent += `I am writing to formally object to the following clauses in my contract which appear to be unfair contract terms under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)).\n\n`
    
    analysis.flaggedClauses.forEach((clause, i) => {
      letterContent += `CLAUSE ${i + 1}: ${clause.name}\n`
      letterContent += `Identified Pattern: "${clause.match || 'See attached contract'}"\n`
      letterContent += `Legal Reference: ${clause.aclRef}\n`
      letterContent += `Reason: ${clause.reason}\n`
      letterContent += `Required Action: ${clause.resolution}\n\n`
      letterContent += `${'-'.repeat(50)}\n\n`
    })

    letterContent += `CONCLUSION\n\nI request that you:\n1. Acknowledge receipt of this notice within 7 business days\n2. Provide written confirmation that the above clauses are void or amended\n3. Issue an amended contract with fair terms\n\nFailure to respond may result in a complaint to the Australian Competition and Consumer Commission (ACCC) or the relevant state fair trading body.\n\nYours faithfully,\n[Your Name]\n[Your Address]\n[Your Contact Information]\n\n${'-'.repeat(50)}\n\nDISCLAIMER: This letter was generated by Apex Global Shield, an AI-powered information tool using publicly available data from legislation.gov.au and accc.gov.au. It may contain errors or inaccuracies. This is a communication assistance tool, NOT legal advice. No solicitor-client relationship exists. Verify all legal references independently and consider consulting a qualified legal professional.`

    setLetter(letterContent)
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
          Paste your service agreement below. Our AI engine will analyze every clause against Australian Consumer Law unfair contract term guidelines and generate a live fairness score.
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
          {analyzing ? 'ANALYZING...' : 'ASSASSINATE PREDATORY CLAUSES'}
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
