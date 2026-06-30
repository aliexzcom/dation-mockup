import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { IcCalendar, IcUsers, IcStaff, IcMoney, IcBell, IcGear, IcCard, IcChevron, IcLogout } from './icons.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'

// Разделы левого меню. Часть пунктов — раскрывающиеся группы (аккордеон),
// как «Аналитика и отчёты» на уровне бизнеса.
const NAV = [
  { to: '/journal', label: 'Журнал записей', Ico: IcCalendar },
  { to: '/clients', label: 'Клиенты (CRM)', Ico: IcUsers },
  { key: 'team', label: 'Команда', Ico: IcStaff, children: [
    { to: '/staff', label: 'Сотрудники' },
    { to: '/users', label: 'Пользователи' },
  ] },
  { to: '/finance', label: 'Финансы', Ico: IcMoney },
  { key: 'notifications', label: 'Уведомления', Ico: IcBell, children: [
    { to: '/notifications', label: 'Автоуведомления', end: true },
    { to: '/notifications/broadcasts', label: 'Рассылки' },
    { to: '/notifications/settings', label: 'Настройки' },
  ] },
  { to: '/settings', label: 'Настройки', Ico: IcGear },
  { to: '/billing', label: 'Тарифы и оплата', Ico: IcCard },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Какая группа содержит активный маршрут — её и раскрываем по умолчанию
  const activeGroup = NAV.find(
    (n) => n.children && n.children.some((c) => location.pathname.startsWith(c.to)),
  )?.key ?? null
  // Аккордеон: одновременно раскрыта только одна группа
  const [openMenu, setOpenMenu] = useState(activeGroup)
  const toggle = (key) => setOpenMenu((o) => (o === key ? null : key))

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">D</div>
          <span className="brand-text">Dation</span>
        </div>
        <div style={{ padding: '6px 8px 0' }}>
          <button
            className="nav-item"
            style={{ width: '100%', border: 0, background: 'var(--violet-50)', color: 'var(--violet)', fontWeight: 600 }}
            title="Выйти на уровень бизнеса"
            onClick={() => navigate('/business/branches')}
          >
            <span className="nav-ico"><IcLogout size={18} /></span>
            <span className="nav-label">На уровень бизнеса</span>
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => {
            // Раскрывающаяся группа
            if (n.children) {
              const groupActive = n.children.some((c) => location.pathname.startsWith(c.to))
              const open = openMenu === n.key
              return (
                <div key={n.key}>
                  <button
                    className={`nav-item ${groupActive ? 'active' : ''}`}
                    style={{ width: '100%', border: 0, background: groupActive ? undefined : 'transparent' }}
                    onClick={() => toggle(n.key)}
                  >
                    <span className="nav-ico"><n.Ico size={18} /></span>
                    <span className="nav-label">{n.label}</span>
                    <span className={`nav-chev ${open ? 'open' : ''}`}><IcChevron size={16} /></span>
                  </button>
                  {open && (
                    <div className="nav-sub">
                      {n.children.map((c) => (
                        <NavLink key={c.to} to={c.to} end={c.end} className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}>
                          <span className="nav-label">{c.label}</span>
                          {c.badge ? <span className="nav-badge">{c.badge}</span> : null}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            // Обычная ссылка
            return (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-ico"><n.Ico size={18} /></span>
                <span className="nav-label">{n.label}</span>
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
