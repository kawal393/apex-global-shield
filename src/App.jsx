import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import ContractAuditor from './pages/ContractAuditor'
import PharmaSearch from './pages/PharmaSearch'
import InsuranceDecoder from './pages/InsuranceDecoder'
import LeaseShield from './pages/LeaseShield'
import EmploymentArmour from './pages/EmploymentArmour'
import FinanceXRay from './pages/FinanceXRay'
import Tribunal from './pages/Tribunal'
import Manifesto from './pages/Manifesto'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/contract-auditor" element={<ContractAuditor />} />
          <Route path="/pharma-search" element={<PharmaSearch />} />
          <Route path="/insurance-decoder" element={<InsuranceDecoder />} />
          <Route path="/lease-shield" element={<LeaseShield />} />
          <Route path="/employment-armour" element={<EmploymentArmour />} />
          <Route path="/finance-xray" element={<FinanceXRay />} />
          <Route path="/oversight" element={<Tribunal />} />
          <Route path="/manifesto" element={<Manifesto />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
