import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ui.jsx'
import { IcCalendar, IcGear, IcLogout } from '../icons.jsx'
import { COMPANY } from '../data.js'

// Каркас POS после входа: боковое меню + верхняя панель + контент.
export default function Layout({ active, title, employee, theme, onLogout, actions, children }) {
  const navigate = useNavigate()

  const nav = [
    { key: 'journal', label: 'Журнал', icon: IcCalendar, go: () => navigate('/journal') },
    { key: 'settings', label: 'Настройки', icon: IcGear, go: () => navigate('/settings') },
  ]

  return (
    <div className="pos">
      <aside className="pos-side">
        <div className="pos-brand">
          <div className="brand-mark" style={{ width: 32, height: 32, fontSize: 15 }}>{COMPANY.short}</div>
          Dation POS
        </div>
        <nav className="pos-nav">
          {nav.map((n) => (
            <div key={n.key} className={'nav-item' + (active === n.key ? ' active' : '')} onClick={n.go}>
              <n.icon /> {n.label}
            </div>
          ))}
        </nav>
        <div className="pos-foot">
          <div className="who">
            <div className="who-ava" style={{ background: employee.color }}>{employee.initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="nm">{employee.name}</div>
              <div className="rl">{employee.role}</div>
            </div>
          </div>
          <div className="foot-btns">
            <button className="btn ghost sm" onClick={() => { onLogout(); navigate('/login') }}>
              <IcLogout size={16} /> Выйти
            </button>
          </div>
        </div>
      </aside>

      <main className="pos-main">
        <header className="pos-top">
          <h1>{title}</h1>
          <div className="spacer" />
          {actions}
          <ThemeToggle theme={theme} />
        </header>
        <div className="pos-body">{children}</div>
      </main>
    </div>
  )
}
