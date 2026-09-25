import React from 'react'
import { ShieldCheck, BookOpen, Flag, RefreshCw } from 'lucide-react'

const commitments = [
  {
    icon: BookOpen,
    title: 'OPEN METHOD',
    body: 'Every rule we check against is public. The contract tools match your text against the Australian Consumer Law unfair-contract-term criteria (ACL ss.23-28) and show you the exact clause, the reference, and why it was flagged. No hidden scoring.'
  },
  {
    icon: ShieldCheck,
    title: 'WE DO NOT JUDGE',
    body: 'Apex Global Shield is an information and drafting-assistance tool. It surfaces what a clause says and where the law is documented. It is not a court, not a regulator, and not a substitute for advice. The decision is always yours.'
  },
  {
    icon: Flag,
    title: 'REPORT AN ERROR',
    body: 'If a flag or a figure looks wrong, tell us. Outputs are pattern- and reference-based and can contain errors or outdated information. You must verify anything you act on against the official sources we link to.'
  },
  {
    icon: RefreshCw,
    title: 'CORRECTIONS ARE LOGGED',
    body: 'Reported corrections are reviewed and the public rule set is updated. Nothing here is guaranteed; the record exists so you can check it yourself, not so you have to trust us.'
  }
]

function Oversight() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">ACCURACY &amp; OVERSIGHT</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          HOW THIS WORKS — AND WHAT IT IS NOT
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We show the clause, the rule, and the source. We do not render verdicts, and we do not claim authority we do not have.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {commitments.map((c, i) => {
          const Icon = c.icon
          return (
            <div key={i} className="card">
              <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-sm tracking-widest text-gold mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm">{c.body}</p>
            </div>
          )
        })}
      </div>

      <div className="p-4 bg-card/50 border border-border rounded-sm">
        <p className="text-muted-foreground text-xs">
          <strong className="text-gold">HONESTY NOTE:</strong> This page previously listed named "tribunal" members with
          professional credentials. Those individuals did not exist and never did. They have been removed. Apex Global Shield
          is software, not a panel of experts, and will present itself as exactly that.
        </p>
      </div>
    </div>
  )
}

export default Oversight
