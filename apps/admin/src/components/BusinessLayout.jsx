import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { IcBranch, IcUsers, IcScissors, IcChart, IcMenu, IcLogout, IcChevron, IcCalendar } from './icons.jsx'
import { REPORT_GROUPS } from '../data/analyticsReports.js'
import { ThemeToggle } from './ThemeToggle.jsx'

// Простые пункты меню уровня бизнеса
const NAV = [
  { to: '/business/branches', label: 'Филиалы', Ico: IcBranch },
  { to: '/business/clients', label: 'Клиенты', Ico: IcUsers },
]

// Подпункты «Telegram Mini App»: те же вкладки, что и внутри страницы
const MINIAPP_SUB = [
  { to: '/business/miniapp', label: 'Настройки', end: true },
  { to: '/business/miniapp/preview', label: 'Предпросмотр записи' },
  { to: '/business/miniapp/bot', label: 'Подключение бота' },
]

// Подпункты «Услуги»: каталог сети — те же разделы, что и на уровне филиала
const SERVICES_SUB = [
  { to: '/business/services', label: 'Список услуг', end: true },
  { to: '/business/services/categories', label: 'Категории' },
  { to: '/business/services/pricing', label: 'Прайс-лист' },
  { to: '/business/services/packages', label: 'Пакеты услуг' },
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

  const miniappActive = location.pathname.startsWith('/business/miniapp')
  const servicesActive = location.pathname.startsWith('/business/services')
  const analyticsActive = location.pathname.startsWith('/business/analytics')
  // Аккордеон: одновременно раскрыт только один раздел
  const [openMenu, setOpenMenu] = useState(
    miniappActive ? 'miniapp' : servicesActive ? 'services' : analyticsActive ? 'analytics' : null,
  )
  const miniappOpen = openMenu === 'miniapp'
  const servicesOpen = openMenu === 'services'
  const analyticsOpen = openMenu === 'analytics'
  const toggle = (key) => setOpenMenu((o) => (o === key ? null : key))

  return (
    <div className="app">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><img src="/logo-mark.svg" alt="Dation" /></div>
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

          {/* Раскрывающийся пункт «Telegram Mini App» */}
          <button className={`nav-item ${miniappActive ? 'active' : ''}`} style={{ width: '100%', border: 0, background: miniappActive ? undefined : 'transparent' }} onClick={() => toggle('miniapp')}>
            <span className="nav-ico"><IcCalendar size={18} /></span>
            <span className="nav-label">Telegram Mini App</span>
            <span className={`nav-chev ${miniappOpen ? 'open' : ''}`}><IcChevron size={16} /></span>
          </button>
          {miniappOpen && !collapsed && (
            <div className="nav-sub">
              {MINIAPP_SUB.map((s) => (
                <NavLink key={s.to} to={s.to} end={s.end} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>{s.label}</NavLink>
              ))}
            </div>
          )}

          {/* Раскрывающийся пункт «Услуги» — каталог сети */}
          <button className={`nav-item ${servicesActive ? 'active' : ''}`} style={{ width: '100%', border: 0, background: servicesActive ? undefined : 'transparent' }} onClick={() => toggle('services')}>
            <span className="nav-ico"><IcScissors size={18} /></span>
            <span className="nav-label">Услуги</span>
            <span className={`nav-chev ${servicesOpen ? 'open' : ''}`}><IcChevron size={16} /></span>
          </button>
          {servicesOpen && !collapsed && (
            <div className="nav-sub">
              {SERVICES_SUB.map((s) => (
                <NavLink key={s.to} to={s.to} end={s.end} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>{s.label}</NavLink>
              ))}
            </div>
          )}

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
