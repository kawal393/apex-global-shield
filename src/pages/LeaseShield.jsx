import React, { useState } from 'react'
import { Lock, AlertTriangle, CheckCircle } from 'lucide-react'
import CertifiedCaseFile from '../components/CertifiedCaseFile'

const leaseClauses = [
  { id: 'break-fee', name: 'EXCESSIVE BREAK FEE', severity: 'high', patterns: [/break\s+fee/i, /lease\s+break\s+cost/i, /early\s+termination\s+penalty/i], aclRef: 'Residential Tenancies Act', reason: 'Break fees that exceed actual landlord losses may be unfair.', resolution: 'I request an itemized breakdown of actual losses caused by early termination.' },
  { id: 'bond-trap', name: 'BOND RETENTION TRAP', severity: 'high', patterns: [/bond\s+will\s+be\s+forfeited/i, /landlord\s+may\s+retain\s+the\s+bond/i, /non-?refundable\s+deposit/i], aclRef: 'Residential Tenancies Act', reason: 'Automatic bond forfeiture without proper assessment is unlawful.', resolution: 'Bond retention must follow statutory procedures and fair assessment.' },
  { id: 'inspection', name: 'UNREASONABLE INSPECTION', severity: 'medium', patterns: [/inspection\s+every/i, /landlord\s+may\s+enter/i, /without\s+notice/i], aclRef: 'Residential Tenancies Act', reason: 'Excessive inspection frequency or entry without notice breaches tenant rights.', resolution: 'I request reasonable inspection frequency with proper notice as required by law.' }
]

const CASE_META = {
  shieldTitle: 'LEASE',
  lawLine: 'the applicable Residential Tenancies Act and Australian Consumer Law',
  registerUrl: 'your state or territory fair-trading / tenancies body',
  complaintIntro: 'I wish to lodge a complaint about unfair or unlawful terms in a residential tenancy or lease agreement, including excessive break fees, bond-retention traps and entry/inspection terms that breach tenancy law.'
}

function LeaseShield() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const flagged = []
      for (const clause of leaseClauses) {
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
          <Lock className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">SHIELD 04</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">LEASE & PROPERTY SHIELD</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload any rental agreement, lease, strata bylaw, or property sale contract. Our AI flags unfair break fees, bond traps, and clauses that violate tenancy law.
          <span className="text-gold font-bold"> Completely free. Always.</span>
        </p>
      </div>
      <div className="card mb-8">
        <textarea className="input w-full h-64 font-mono text-sm resize-none" placeholder="Paste your lease or rental contract text here..." value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleAnalyze} disabled={analyzing || !text} className="btn-primary w-full mt-4">{analyzing ? 'ANALYZING...' : 'ANALYZE LEASE CONTRACT'}</button>
      </div>
      {analysis && (
        <div className="space-y-6">
          <div className="card border-gold/30">
            <h3 className="font-heading text-sm tracking-widest text-gold mb-4">TENANCY ANALYSIS</h3>
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

export default LeaseShield
