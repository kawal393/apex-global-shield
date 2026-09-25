import React from 'react'
import { Shield, Github, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function Manifesto() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
          <Shield className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs tracking-widest font-heading">OPEN SOURCE</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">WHY WE EXIST</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A consumer's right to see every word before signing
        </p>
      </div>

      <div className="space-y-8">
        <div className="card">
          <h2 className="font-heading text-xl font-bold text-gold mb-4">PREAMBLE</h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe that consumer protection is not a privilege granted by institutions, but a fundamental human right. For too long, the power has been concentrated in the hands of those who write the contracts, set the prices, and hide the traps. Today, we return that power to the people.
          </p>
        </div>

        <div className="card">
          <h2 className="font-heading text-xl font-bold text-gold mb-4">THE SEVEN PRINCIPLES</h2>
          <div className="space-y-4">
            {[
              'TRUTH: Every consumer has the right to see the truth hidden in fine print.',
              'TRANSPARENCY: Every price gap, every hidden fee, every unfair clause must be exposed.',
              'ACCESS: Consumer protection tools must be free, open, and available to all.',
              'SOVEREIGNTY: Every individual is the sovereign of their own rights and choices.',
              'ACCOUNTABILITY: Those who write unfair contracts must be held accountable.',
              'OPEN SOURCE: The code that protects the people must be open for all to verify.',
              'PERMANENCE: The core tools are free forever. Optional paid services fund them and never gate your rights.',
            ].map((principle, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-gold font-bold text-lg">{i + 1}.</span>
                <p className="text-muted-foreground">{principle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card border-gold/30">
          <h2 className="font-heading text-xl font-bold text-gold mb-4">THE PROMISE</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The tools here are free, and will stay free. We will never sell your data. Optional paid services - verified, ready-to-send reports and business tools - fund the free shields; they never lock away your rights. Knowing your rights is not something we will ever put behind a paywall.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://github.com/kawal393/apex-shield-logic" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Github className="w-4 h-4 mr-2" />
              VIEW SOURCE CODE
            </a>
            <Link to="/" className="btn-secondary">
              RETURN TO SHIELDS
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Manifesto
