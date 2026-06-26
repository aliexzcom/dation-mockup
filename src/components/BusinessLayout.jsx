import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { IcBranch, IcUsers, IcChart, IcBox, IcMenu, IcLogout } from './icons.jsx'

// Меню уровня бизнеса (компания / сеть)
const NAV = [
  { to: '/business/branches', label: 'Филиалы', Ico: IcBranch },
  { to: '/business/clients', label: 'Клиенты', Ico: IcUsers },
  { to: '/business/analytics', label: 'Аналитика и отчёты', Ico: IcChart },
  { to: '/business/inventory-reports', label: 'Отчёты по товарам', Ico: IcBox },
]

export default function BusinessLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="app">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">D</div>
          <span className="brand-text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Dation <span className="badge" style={{ fontSize: 10 }}>Бизнес</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-ico"><n.Ico size={18} /></span>
              <span className="nav-label">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 0 }} onClick={() => setCollapsed(!collapsed)}>
            <span className="nav-ico"><IcMenu size={18} /></span>
            <span className="nav-label">Свернуть меню</span>
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setCollapsed(!collapsed)}><IcMenu size={18} /></button>
          <div className="branch-switch" style={{ cursor: 'default' }}>
            <span>Beauty Studio «Аура»</span>
          </div>
          <div className="topbar-spacer" />
          <span className="small muted">Олег Владимиров · Владелец</span>
          <button className="btn ghost" onClick={() => navigate('/login')}>
            <IcLogout size={16} /> Выйти
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
