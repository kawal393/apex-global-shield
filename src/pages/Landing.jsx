import React, { useState, useEffect } from 'react'
import { Shield, ChevronRight, Zap, Search, Lock, FileText, Briefcase, DollarSign, ArrowRight, Github, Users, TrendingUp, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

const shields = [
  {
    id: 'contract-auditor',
    icon: FileText,
    number: '01',
    title: 'CONTRACT HEALTH AUDITOR',
    description: 'Upload any contract. AI scans against ACL ss.23-28. Get fairness score + flagged clauses.',
    path: '/contract-auditor'
  },
  {
    id: 'pharma-search',
    icon: Search,
    number: '02',
    title: 'THERAPEUTIC TRANSPARENCY PORTAL',
    description: 'Search 100+ medications. Expose brand vs generic price gaps. Save thousands.',
    path: '/pharma-search'
  },
  {
    id: 'insurance-decoder',
    icon: Shield,
    number: '03',
    title: 'INSURANCE DECODER',
    description: 'Upload PDS or policy. AI flags hidden exclusions, denial traps, and excess traps.',
    path: '/insurance-decoder'
  },
  {
    id: 'lease-shield',
    icon: Lock,
    number: '04',
    title: 'LEASE & PROPERTY SHIELD',
    description: 'Upload rental or lease contracts. AI flags unfair bond traps and break fees.',
    path: '/lease-shield'
  },
  {
    id: 'employment-armour',
    icon: Briefcase,
    number: '05',
    title: 'EMPLOYMENT ARMOUR',
    description: 'Upload employment contracts. AI flags non-compete overreach and IP traps.',
    path: '/employment-armour'
  },
  {
    id: 'finance-xray',
    icon: DollarSign,
    number: '06',
    title: 'FINANCE X-RAY',
    description: 'Upload loan or credit contracts. AI exposes hidden fees and rate traps.',
    path: '/finance-xray'
  }
]

const stats = [
  { value: '6', label: 'SOVEREIGN SHIELDS' },
  { value: '100+', label: 'MEDICATIONS INDEXED' },
  { value: '100%', label: 'FREE FOREVER' },
  { value: '0', label: 'PAYWALLS' }
]

function Landing() {
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const targets = [6, 100, 100, 0]
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounts(targets.map(target => Math.round(target * progress)))
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-grid">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
            <span className="text-gold text-xs tracking-widest font-heading">100% FREE · OPEN SOURCE · SCP-1 PROTOCOL</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-glow">
            THE CODE IS FREE.<br />
            <span className="text-gold">THE PEOPLE ARE SOVEREIGN.</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-12">
            Six sovereign shields protecting consumers from predatory contracts, pharma monopolies, insurance traps, lease traps, employment exploitation, and finance deception.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contract-auditor" className="btn-primary">
              EXPLORE ALL SHIELDS — 100% FREE
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a href="https://github.com/kawal393/apex-shield-logic" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Github className="w-4 h-4 mr-2" />
              VIEW SOURCE CODE
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-gold mb-2">
                  {stat.value === '100+' ? `${counts[i]}+` : counts[i]}
                </div>
                <div className="text-muted-foreground text-xs tracking-widest font-heading">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shields Grid */}
      <section id="tools" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              SIX SHIELDS · EVERY INDUSTRY
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              YOUR RIGHTS. PROTECTED.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shields.map((shield) => {
              const Icon = shield.icon
              return (
                <Link
                  key={shield.id}
                  to={shield.path}
                  className="card group hover:border-gold/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <span className="text-muted-foreground text-xs font-heading tracking-widest">SHIELD {shield.number}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
                    {shield.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">{shield.description}</p>
                  <div className="flex items-center text-gold text-xs font-heading tracking-widest">
                    ACTIVATE SHIELD
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Support the Mission */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            SUPPORT THE MISSION
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            EVERYTHING IS FREE. FOREVER.
          </p>
          <p className="text-muted-foreground mb-12">
            We believe consumer protection is a human right — not a product. Every tool, every report, every letter is free with no limits. If our work helped you, consider a voluntary contribution to keep the shields powered.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[1, 5, 10, 25].map((amount) => (
              <button key={amount} className="btn-secondary">
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            THE CONSUMER CANNOT BE FOOLED.
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            NOT EVER AGAIN.
          </p>
          <Link to="/contract-auditor" className="btn-primary text-lg px-12 py-4">
            ACTIVATE YOUR FIRST SHIELD
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
