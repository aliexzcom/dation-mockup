import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import BusinessLayout from './components/BusinessLayout.jsx'
import Journal from './pages/Journal.jsx'
import MiniApp from './pages/MiniApp.jsx'
import Clients from './pages/Clients.jsx'
import Services from './pages/Services.jsx'
import Staff from './pages/Staff.jsx'
import Finance from './pages/Finance.jsx'
import Inventory from './pages/Inventory.jsx'
import Notifications from './pages/Notifications.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'
import Billing from './pages/Billing.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Onboarding from './pages/Onboarding.jsx'
import SelectBranch from './pages/SelectBranch.jsx'
import InventoryReportView from './pages/InventoryReportView.jsx'

export default function App() {
  return (
    <Routes>
      {/* Экраны вне рабочего каркаса */}
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Уровень бизнеса (компания / сеть) */}
      <Route path="/business" element={<BusinessLayout />}>
        <Route index element={<Navigate to="/business/branches" replace />} />
        <Route path="branches" element={<SelectBranch />} />
        <Route path="clients" element={<Clients />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="analytics/:group" element={<Analytics />} />
        <Route path="inventory-reports" element={<Navigate to="/business/inventory-reports/ostatki" replace />} />
        <Route path="inventory-reports/:slug" element={<InventoryReportView />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/journal" replace />} />
        <Route path="journal" element={<Journal />} />
        <Route path="miniapp" element={<MiniApp />} />
        <Route path="clients" element={<Clients />} />
        <Route path="services" element={<Services />} />
        <Route path="staff" element={<Staff />} />
        <Route path="finance" element={<Finance />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="billing" element={<Billing />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/journal" replace />} />
      </Route>
    </Routes>
  )
}
