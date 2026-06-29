import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { NAV_ICONS, IcBell, IcLogout } from './icons.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'

// Разделы левого меню — строго по п. 3.2 ТЗ
const NAV = [
  { to: '/journal', key: 'journal', label: 'Журнал записей' },
  { to: '/miniapp', key: 'miniapp', label: 'Telegram Mini App', badge: 3 }, // индикатор новых записей из Mini App (п. 3.1)
  { to: '/clients', key: 'clients', label: 'Клиенты (CRM)' },
  { to: '/services', key: 'services', label: 'Услуги' },
  { to: '/staff', key: 'staff', label: 'Сотрудники' },
  { to: '/finance', key: 'finance', label: 'Финансы' },
  { to: '/inventory', key: 'inventory', label: 'Склад' },
  { to: '/notifications', key: 'notifications', label: 'Уведомления' },
  { to: '/settings', key: 'settings', label: 'Настройки' },
  { to: '/billing', key: 'billing', label: 'Тарифы и оплата' },
]

export default function Layout() {
  const navigate = useNavigate()
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">D</div>
          <span className="brand-text">Dation</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => {
            const Ico = NAV_ICONS[n.key]
            return (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-ico"><Ico size={18} /></span>
                <span className="nav-label">{n.label}</span>
                {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
              </NavLink>
            )
          })}
        </nav>
        <div className="sidebar-foot" style={{ display: 'flex', gap: 6, justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="icon-btn" title="Профиль" onClick={() => navigate('/profile')}>
            <span className="avatar-sm" style={{ width: 28, height: 28, fontSize: 11 }}>ОВ</span>
          </button>
          <button className="icon-btn" title="Уведомления">
            <IcBell size={18} /><span className="dot" />
          </button>
          <ThemeToggle compact />
          <button className="icon-btn" title="Выйти из филиала" onClick={() => navigate('/business/branches')}>
            <IcLogout size={18} />
          </button>
        </div>
      </aside>

      <div className="main">
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
