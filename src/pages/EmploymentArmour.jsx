import React, { useState } from 'react'
import { Briefcase, AlertTriangle } from 'lucide-react'
import CertifiedCaseFile from '../components/CertifiedCaseFile'

const employmentClauses = [
  { id: 'non-compete', name: 'UNREASONABLE NON-COMPETE', severity: 'high', patterns: [/non-?compete/i, /restraint\s+of\s+trade/i, /shall\s+not\s+work\s+for/i], aclRef: 'Fair Work Act 2009', reason: 'Non-compete clauses that are too broad in scope or duration may be unenforceable.', resolution: 'I request the non-compete be limited to reasonable scope, duration, and geographic area.' },
  { id: 'ip-overreach', name: 'IP OWNERSHIP OVERREACH', severity: 'high', patterns: [/all\s+intellectual\s+property/i, /inventions\s+shall\s+belong\s+to/i, /work\s+product\s+belongs/i], aclRef: 'Fair Work Act 2009', reason: 'Claiming ownership of all IP including personal projects may be unreasonable.', resolution: 'I request IP ownership be limited to work directly related to employment duties during work hours.' },
  { id: 'unpaid-overtime', name: 'UNPAID OVERTIME REQUIREMENT', severity: 'medium', patterns: [/unpaid\s+overtime/i, /additional\s+hours\s+as\s+required/i, /no\s+overtime\s+payment/i], aclRef: 'Fair Work Act 2009 - NES', reason: 'Requiring unpaid overtime may breach the National Employment Standards.', resolution: 'I request clarification on overtime compensation in accordance with NES requirements.' }
]

const CASE_META = {
  shieldTitle: 'EMPLOYMENT',
  lawLine: 'the Fair Work Act 2009 and the National Employment Standards',
  registerUrl: 'fairwork.gov.au',
  complaintIntro: 'I wish to lodge a complaint about unfair or unlawful terms in an employment or contractor agreement, including unreasonable restraint of trade, IP overreach and unpaid-overtime provisions that may breach the Fair Work Act 2009.'
}

function EmploymentArmour() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const flagged = []
      for (const clause of employmentClauses) {
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
          <Briefcase className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">SHIELD 05</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">EMPLOYMENT ARMOUR</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload any employment contract, NDA, non-compete, or contractor agreement. Our AI flags unreasonable restraints of trade, IP overreach, and clauses that violate the Fair Work Act 2009.
          <span className="text-gold font-bold"> Completely free. Always.</span>
        </p>
      </div>
      <div className="card mb-8">
        <textarea className="input w-full h-64 font-mono text-sm resize-none" placeholder="Paste your employment contract text here..." value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleAnalyze} disabled={analyzing || !text} className="btn-primary w-full mt-4">{analyzing ? 'ANALYZING...' : 'ANALYZE EMPLOYMENT CONTRACT'}</button>
      </div>
      {analysis && (
        <div className="space-y-6">
          <div className="card border-gold/30">
            <h3 className="font-heading text-sm tracking-widest text-gold mb-4">EMPLOYMENT ANALYSIS</h3>
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

export default EmploymentArmour
