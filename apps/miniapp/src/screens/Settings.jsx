import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Frame } from '../components/ui.jsx'
import { IcCheck, IcSun, IcMoon } from '../icons.jsx'

const LANGS = [
  { id: 'ru', label: 'Русский' },
  { id: 'uz', label: "O'zbekcha" },
  { id: 'en', label: 'English' },
]

export default function Settings({ theme }) {
  const navigate = useNavigate()
  const [lang, setLang] = useState('ru')

  return (
    <Frame title="Настройки" onBack={() => navigate(-1)}>
      <div className="pad">
        <div className="sec-title">Язык</div>
        <div className="menu-card">
          {LANGS.map((l) => (
            <button key={l.id} className="mrow" onClick={() => setLang(l.id)}>
              <span className="ml">{l.label}</span>
              {lang === l.id && <span className="mi"><IcCheck size={18} /></span>}
            </button>
          ))}
        </div>

        <div className="sec-title">Тема оформления</div>
        <div className="seg2">
          <button className={'seg2-btn' + (!theme.dark ? ' active' : '')} onClick={() => { if (theme.dark) theme.toggle() }}>
            <IcSun size={18} /> Светлая
          </button>
          <button className={'seg2-btn' + (theme.dark ? ' active' : '')} onClick={() => { if (!theme.dark) theme.toggle() }}>
            <IcMoon size={18} /> Тёмная
          </button>
        </div>

        <div className="note-mini">
          Язык и тема применяются ко всему приложению. В Telegram тема может синхронизироваться с оформлением мессенджера.
        </div>
      </div>
    </Frame>
  )
}
