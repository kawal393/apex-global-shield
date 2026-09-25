import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Download } from 'lucide-react'
import CertifiedCaseFile from '../components/CertifiedCaseFile'

const insuranceClauses = [
  {
    id: 'pre-existing',
    name: 'PRE-EXISTING CONDITION EXCLUSION',
    severity: 'high',
    patterns: [/pre-?existing\s+condition/i, /prior\s+medical\s+history/i, /known\s+health\s+issue/i],
    aclRef: 'Insurance Contracts Act 1984 s.21',
    reason: 'Broad pre-existing condition exclusions may be unfair if not clearly disclosed at time of purchase.',
    resolution: 'I request a clear definition of what constitutes a pre-existing condition under this policy.'
  },
  {
    id: 'excess-trap',
    name: 'EXCESS AMOUNT TRAP',
    severity: 'medium',
    patterns: [/excess\s+amount/i, /you\s+must\s+pay\s+the\s+first/i, /deductible\s+applies/i],
    aclRef: 'ASIC RG 183',
    reason: 'Excessive excess amounts that make claims impractical may be unfair.',
    resolution: 'I request clarification on the excess amount and its proportionality to the premium paid.'
  },
  {
    id: 'denial-trigger',
    name: 'HIDDEN DENIAL TRIGGER',
    severity: 'high',
    patterns: [/we\s+reserve\s+the\s+right\s+to\s+deny/i, /claim\s+may\s+be\s+rejected/i, /at\s+our\s+sole\s+discretion/i],
    aclRef: 'Insurance Contracts Act 1984 s.13',
    reason: 'Unfettered discretion to deny claims breaches the duty of utmost good faith.',
    resolution: 'I request specific, objective criteria for claim denial rather than discretionary language.'
  }
]

const CASE_META = {
  shieldTitle: 'INSURANCE',
  lawLine: 'the Insurance Contracts Act 1984 and ASIC RG 183',
  registerUrl: 'asic.gov.au and insuranceoombudsman.gov.au',
  complaintIntro: 'I wish to lodge a complaint about unfair or unlawful terms in an insurance policy, including broad pre-existing-condition exclusions, disproportionate excesses and discretionary claim-denial triggers that may breach the duty of utmost good faith under the Insurance Contracts Act 1984.'
}

function InsuranceDecoder() {
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const flagged = []
      for (const clause of insuranceClauses) {
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
          <Shield className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">SHIELD 03</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">INSURANCE DECODER</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload any PDS, policy document, or claim terms. Our AI scans for hidden exclusions, unfair denial triggers, and excess traps under the Insurance Contracts Act 1984.
          <span className="text-gold font-bold"> Completely free. Always.</span>
        </p>
      </div>

      <div className="card mb-8">
        <textarea
          className="input w-full h-64 font-mono text-sm resize-none"
          placeholder="Paste your insurance policy text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleAnalyze} disabled={analyzing || !text} className="btn-primary w-full mt-4">
          {analyzing ? 'ANALYZING...' : 'DECODE INSURANCE POLICY'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="card border-gold/30">
            <h3 className="font-heading text-sm tracking-widest text-gold mb-4">INSURANCE ANALYSIS</h3>
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
        <p className="text-muted-foreground text-xs">
          <strong className="text-gold">DISCLAIMER:</strong> This analysis was generated by Apex Global Shield using publicly available data. NOT legal advice. No solicitor-client relationship is created. Verify all references independently.
        </p>
      </div>
    </div>
  )
}

export default InsuranceDecoder
