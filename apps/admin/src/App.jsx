import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import BusinessLayout from './components/BusinessLayout.jsx'
import Journal from './pages/Journal.jsx'
import MiniApp from './pages/MiniApp.jsx'
import Clients from './pages/Clients.jsx'
import Services from './pages/Services.jsx'
import Staff from './pages/Staff.jsx'
import Users from './pages/Users.jsx'
import Finance from './pages/Finance.jsx'
import Notifications from './pages/Notifications.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'
import Devices from './pages/Devices.jsx'
import Billing from './pages/Billing.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Onboarding from './pages/Onboarding.jsx'
import SelectBranch from './pages/SelectBranch.jsx'

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
        <Route path="miniapp" element={<MiniApp view="settings" />} />
        <Route path="miniapp/preview" element={<MiniApp view="preview" />} />
        <Route path="miniapp/bot" element={<MiniApp view="bot" />} />
        <Route path="services" element={<Services business view="list" />} />
        <Route path="services/categories" element={<Services business view="categories" />} />
        <Route path="services/pricing" element={<Services business view="pricing" />} />
        <Route path="services/packages" element={<Services business view="packages" />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="analytics/:group" element={<Analytics />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/journal" replace />} />
        <Route path="journal" element={<Journal />} />
        <Route path="clients" element={<Clients />} />
        <Route path="staff" element={<Staff />} />
        <Route path="users" element={<Users />} />
        <Route path="finance" element={<Finance />} />
        <Route path="notifications" element={<Notifications view="auto" />} />
        <Route path="notifications/broadcasts" element={<Notifications view="broadcasts" />} />
        <Route path="notifications/settings" element={<Notifications view="settings" />} />
        <Route path="settings" element={<Settings />} />
        <Route path="devices" element={<Devices />} />
        <Route path="billing" element={<Billing />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/journal" replace />} />
      </Route>
    </Routes>
  )
}
