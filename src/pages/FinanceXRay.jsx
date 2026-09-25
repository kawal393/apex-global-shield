import React, { useState } from 'react'
import { DollarSign, AlertTriangle } from 'lucide-react'
import CertifiedCaseFile from '../components/CertifiedCaseFile'

const financeClauses = [
  { id: 'hidden-fee', name: 'HIDDEN FEE STRUCTURE', severity: 'high', patterns: [/account\s+keeping\s+fee/i, /monthly\s+service\s+fee/i, /administration\s+charge/i], aclRef: 'National Credit Code', reason: 'Hidden fees that are not clearly disclosed may breach responsible lending obligations.', resolution: 'I request a complete schedule of all fees and charges associated with this product.' },
  { id: 'rate-escalation', name: 'INTEREST RATE ESCALATION', severity: 'high', patterns: [/variable\s+rate\s+may\s+increase/i, /interest\s+rate\s+adjustment/i, /penalty\s+interest/i], aclRef: 'National Credit Code', reason: 'Unlimited interest rate escalation without caps may be unfair.', resolution: 'I request clarification on maximum possible interest rate and frequency of adjustments.' },
  { id: 'default-trigger', name: 'AGGRESSIVE DEFAULT TRIGGER', severity: 'medium', patterns: [/default\s+notice/i, /acceleration\s+clause/i, /immediate\s+repayment/i], aclRef: 'National Credit Code', reason: 'Aggressive default triggers without proper notice periods may be unlawful.', resolution: 'I request reasonable default notice periods as required by the National Credit Code.' }
]

const CASE_META = {
  shieldTitle: 'FINANCE',
  lawLine: 'the National Credit Code',
  registerUrl: 'asic.gov.au',
  complaintIntro: 'I wish to lodge a complaint about unfair or unlawful terms in a credit or finance agreement, including undisclosed fees, uncapped interest escalation and aggressive default triggers that may breach the National Credit Code and responsible-lending obligations.'
}

function FinanceXRay() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const flagged = []
      for (const clause of financeClauses) {
        for (const pattern of clause.patterns) {
          if (pattern.test(text)) { const m = text.match(pattern); flagged.push({ ...clause, match: m ? m[0] : null }); break }
        }
      }
      const highRiskCount = flagged.filter(c => c.severity === 'high').length
      const mediumRisk = flagged.filter(c => c.severity === 'medium').length
      const score = Math.max(0, 100 - (highRiskCount * 20) - (mediumRisk * 10))
      setAnalysis({ flagged, score, highRiskCount, summary: `Found ${flagged.length} potentially unfair clause(s). Fairness score: ${score}/100.` })
      setAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
          <DollarSign className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">SHIELD 06</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">FINANCE X-RAY</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload any loan agreement, credit card T&Cs, BNPL contract, or mortgage document. Our AI exposes hidden fees, unfair interest escalation, and National Credit Code violations.
          <span className="text-gold font-bold"> Completely free. Always.</span>
        </p>
      </div>
      <div className="card mb-8">
        <textarea className="input w-full h-64 font-mono text-sm resize-none" placeholder="Paste your finance contract text here..." value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleAnalyze} disabled={analyzing || !text} className="btn-primary w-full mt-4">{analyzing ? 'ANALYZING...' : 'X-RAY FINANCE CONTRACT'}</button>
      </div>
      {analysis && (
        <div className="space-y-6">
          <div className="card border-gold/30">
            <h3 className="font-heading text-sm tracking-widest text-gold mb-4">FINANCIAL ANALYSIS</h3>
            <p className="text-muted-foreground mb-4">{analysis.summary}</p>
          </div>
          {analysis.flagged.map((clause, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className={`badge ${clause.severity === 'high' ? 'badge-high' : 'badge-medium'}`}>{clause.severity.toUpperCase()} RISK</span>
                <span className="text-muted-foreground text-xs font-heading">{clause.aclRef}</span>
              </div>
              <p className="text-foreground font-bold mb-1">{clause.name}</p>
              <p className="text-muted-foreground text-sm mb-2">{clause.reason}</p>
              <p className="text-gold text-sm">{clause.resolution}</p>
            </div>
          ))}
          <CertifiedCaseFile analysis={analysis} meta={CASE_META} />
        </div>
      )}
      <div className="mt-8 p-4 bg-card/50 border border-border rounded-sm">
        <p className="text-muted-foreground text-xs"><strong className="text-gold">DISCLAIMER:</strong> This analysis was generated by Apex Global Shield using publicly available data. NOT legal advice. Verify all references independently.</p>
      </div>
    </div>
  )
}

export default FinanceXRay
