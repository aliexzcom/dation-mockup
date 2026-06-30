import { useState, useEffect } from 'react'
import { IcMoon, IcSun } from './icons.jsx'

// Переключатель светлой/тёмной темы (класс .dark на <html>)
export function ThemeToggle({ compact }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const title = dark ? 'Светлая тема' : 'Тёмная тема'

  if (compact) {
    return (
      <button className="icon-btn" title={title} onClick={() => setDark((d) => !d)}>
        {dark ? <IcSun size={18} /> : <IcMoon size={18} />}
      </button>
    )
  }

  return (
    <button className="nav-item" style={{ width: '100%', background: 'transparent', border: 0 }} onClick={() => setDark((d) => !d)}>
      <span className="nav-ico">{dark ? <IcSun size={18} /> : <IcMoon size={18} />}</span>
      <span className="nav-label">{title}</span>
    </button>
  )
}
