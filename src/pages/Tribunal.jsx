import React from 'react'
import { Scale, Users, Shield, CheckCircle } from 'lucide-react'

const tribunalMembers = [
  { name: 'Hon. Justice Sarah Chen', role: 'Chair — Consumer Law Expert', background: 'Former ACCC Commissioner, 20 years in consumer protection law.' },
  { name: 'Dr. Marcus Williams', role: 'Member — AI Ethics Specialist', background: 'Leading researcher in AI transparency and algorithmic accountability.' },
  { name: 'Elena Rodriguez', role: 'Member — Data Privacy Advocate', background: 'Former Privacy Commissioner, expert in data protection and consumer rights.' },
  { name: 'James O\'Brien', role: 'Member — Financial Services Expert', background: '25 years in banking regulation and consumer finance protection.' },
  { name: 'Dr. Aisha Patel', role: 'Member — Pharmaceutical Policy', background: 'Former TGA advisor, expert in drug pricing and generic substitution policy.' }
]

function Tribunal() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
          <Scale className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">HIGH TRIBUNAL</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">THE HIGH TRIBUNAL</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Independent oversight and audit of all AI-generated analyses. Ensuring accuracy, fairness, and accountability.
        </p>
      </div>

      <div className="grid gap-6 mb-12">
        {tribunalMembers.map((member, i) => (
          <div key={i} className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-gold text-sm font-heading tracking-widest mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.background}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-gold/30">
        <h3 className="font-heading text-sm tracking-widest text-gold mb-4">AUDIT PROCESS</h3>
        <div className="space-y-4">
          {[
            'All AI outputs are logged and timestamped for transparency.',
            'Random audits conducted monthly by tribunal members.',
            'Users can flag inaccurate analyses for tribunal review.',
            'Quarterly public reports on accuracy and fairness metrics.',
            'Appeals process available for disputed contract analyses.'
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tribunal
