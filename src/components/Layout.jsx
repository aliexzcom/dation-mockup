import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { NAV_ICONS, IcSearch, IcPlus, IcBell, IcChevron, IcMenu, IcLogout } from './icons.jsx'

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
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="app">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
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
        <div className="sidebar-foot">
          <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 0 }} onClick={() => navigate('/business/branches')}>
            <span className="nav-ico"><IcLogout size={18} /></span>
            <span className="nav-label">Выйти из филиала</span>
          </button>
          <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 0 }} onClick={() => setCollapsed(!collapsed)}>
            <span className="nav-ico"><IcMenu size={18} /></span>
            <span className="nav-label">Свернуть меню</span>
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setCollapsed(!collapsed)}><IcMenu size={18} /></button>
          <div className="branch-switch" onClick={() => navigate('/business/branches')} title="Сменить филиал">
            <span>Филиал: Центральный</span>
            <IcChevron size={16} />
          </div>
          <div className="search">
            <IcSearch size={18} />
            <input placeholder="Поиск: клиент, запись, телефон" />
          </div>
          <div className="topbar-spacer" />
          <button className="btn" onClick={() => navigate('/journal')}><IcPlus size={16} /> Быстрая запись</button>
          <button className="icon-btn" title="Уведомления"><IcBell size={18} /><span className="dot" /></button>
          <div className="avatar" title="Профиль пользователя" onClick={() => navigate('/profile')}>ОВ</div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
