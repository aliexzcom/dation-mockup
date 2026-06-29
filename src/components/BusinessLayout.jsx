import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { IcBranch, IcUsers, IcChart, IcBox, IcMenu, IcLogout, IcChevron } from './icons.jsx'
import { REPORTS } from '../data/inventoryReports.js'
import { REPORT_GROUPS } from '../data/analyticsReports.js'
import { ThemeToggle } from './ThemeToggle.jsx'

// Простые пункты меню уровня бизнеса
const NAV = [
  { to: '/business/branches', label: 'Филиалы', Ico: IcBranch },
  { to: '/business/clients', label: 'Клиенты', Ico: IcUsers },
]

// Подпункты «Аналитика и отчёты»: Дашборд + группы отчётов
const ANALYTICS_SUB = [
  { to: '/business/analytics', label: 'Дашборд', end: true },
  ...REPORT_GROUPS.map((g) => ({ to: `/business/analytics/${g.slug}`, label: g.group })),
]

export default function BusinessLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const analyticsActive = location.pathname.startsWith('/business/analytics')
  const reportsActive = location.pathname.startsWith('/business/inventory-reports')
  // Аккордеон: одновременно раскрыт только один раздел
  const [openMenu, setOpenMenu] = useState(analyticsActive ? 'analytics' : reportsActive ? 'reports' : null)
  const analyticsOpen = openMenu === 'analytics'
  const reportsOpen = openMenu === 'reports'
  const toggle = (key) => setOpenMenu((o) => (o === key ? null : key))

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
            <NavLink key={n.to} to={n.to} onClick={() => setOpenMenu(null)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-ico"><n.Ico size={18} /></span>
              <span className="nav-label">{n.label}</span>
            </NavLink>
          ))}

          {/* Раскрывающийся пункт «Аналитика и отчёты» */}
          <button className={`nav-item ${analyticsActive ? 'active' : ''}`} style={{ width: '100%', border: 0, background: analyticsActive ? undefined : 'transparent' }} onClick={() => toggle('analytics')}>
            <span className="nav-ico"><IcChart size={18} /></span>
            <span className="nav-label">Аналитика и отчёты</span>
            <span className={`nav-chev ${analyticsOpen ? 'open' : ''}`}><IcChevron size={16} /></span>
          </button>
          {analyticsOpen && !collapsed && (
            <div className="nav-sub">
              {ANALYTICS_SUB.map((s) => (
                <NavLink key={s.to} to={s.to} end={s.end} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>{s.label}</NavLink>
              ))}
            </div>
          )}

          {/* Раскрывающийся пункт «Отчёты по товарам» */}
          <button className={`nav-item ${reportsActive ? 'active' : ''}`} style={{ width: '100%', border: 0, background: reportsActive ? undefined : 'transparent' }} onClick={() => toggle('reports')}>
            <span className="nav-ico"><IcBox size={18} /></span>
            <span className="nav-label">Отчёты по товарам</span>
            <span className={`nav-chev ${reportsOpen ? 'open' : ''}`}><IcChevron size={16} /></span>
          </button>
          {reportsOpen && !collapsed && (
            <div className="nav-sub">
              {REPORTS.map((r) => (
                <NavLink key={r.id} to={`/business/inventory-reports/${r.id}`} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>{r.title}</NavLink>
              ))}
            </div>
          )}
        </nav>
        <div className="sidebar-foot">
          <ThemeToggle />
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
