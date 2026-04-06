import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Menu, X, ChevronRight, Github, Scale } from 'lucide-react'

const navItems = [
  { label: 'HOME', path: '/' },
  { label: 'CONTRACT AUDITOR', path: '/contract-auditor' },
  { label: 'PHARMA SEARCH', path: '/pharma-search' },
  { label: 'INSURANCE DECODER', path: '/insurance-decoder' },
  { label: 'LEASE SHIELD', path: '/lease-shield' },
  { label: 'EMPLOYMENT ARMOUR', path: '/employment-armour' },
  { label: 'FINANCE X-RAY', path: '/finance-xray' },
  { label: 'TRIBUNAL', path: '/tribunal' },
  { label: 'MANIFESTO', path: '/manifesto' }
]

function Layout({ children }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Status Bar */}
      <div className="bg-gold/10 border-b border-gold/20 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-gold text-xs tracking-widest font-heading">
          <Scale className="w-3 h-3" />
          <span>SOVEREIGN CONSUMER PROTECTION ENGINE — 100% FREE · OPEN SOURCE · SCP-1 PROTOCOL</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-gold" />
              <span className="font-heading text-sm tracking-[0.2em] text-gold">APEX GLOBAL SHIELD</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-heading text-[10px] tracking-[0.15em] transition-colors ${
                    location.pathname === item.path
                      ? 'text-gold'
                      : 'text-muted-foreground hover:text-gold'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center text-gold"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block font-heading text-sm tracking-widest py-4 px-4 rounded transition-colors min-h-[48px] flex items-center ${
                  location.pathname === item.path
                    ? 'text-gold bg-gold/10'
                    : 'text-muted-foreground hover:text-gold-light hover:bg-surface-elevated'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-gold" />
                <span className="font-heading text-xs tracking-[0.2em] text-gold">APEX GLOBAL SHIELD</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Sovereign Consumer Protection Engine — 100% Free. Open Source. Built for humanity.
              </p>
            </div>
            <div>
              <h4 className="font-heading text-xs tracking-widest text-gold mb-4">SHIELDS</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contract-auditor" className="hover:text-gold transition-colors">Contract Auditor</Link></li>
                <li><Link to="/pharma-search" className="hover:text-gold transition-colors">Pharma Portal</Link></li>
                <li><Link to="/insurance-decoder" className="hover:text-gold transition-colors">Insurance Decoder</Link></li>
                <li><Link to="/lease-shield" className="hover:text-gold transition-colors">Lease Shield</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-xs tracking-widest text-gold mb-4">RESOURCES</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/manifesto" className="hover:text-gold transition-colors">Manifesto</Link></li>
                <li><Link to="/tribunal" className="hover:text-gold transition-colors">High Tribunal</Link></li>
                <li><a href="https://github.com/kawal393/apex-shield-logic" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-1"><Github className="w-3 h-3" /> Source Code</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-xs tracking-widest text-gold mb-4">LEGAL</h4>
              <p className="text-muted-foreground text-xs">
                ABN: 71 672 237 795 | ACN: 672 237 795
                <br />
                Apex Intelligence Empire
                <br />
                Victoria, Australia
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Apex Intelligence Empire. Open Source. Free Forever.
            </p>
            <p className="text-gold/60 text-xs font-heading tracking-widest">
              Consumer Protection is a Human Right™
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
