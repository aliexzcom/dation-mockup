import { useNavigate } from 'react-router-dom'
import { Frame } from '../components/ui.jsx'
import { IcPhone, IcPin, IcSend, IcChevR } from '../icons.jsx'
import { CLIENT, COMPANY, TG_CHANNELS } from '../data.js'

// Экран профиля клиента (открывается из бургер-меню)
export default function Profile() {
  const navigate = useNavigate()

  const shareNumber = () => {
    const data = { title: COMPANY.name, text: `Мой номер: ${CLIENT.phone}` }
    if (navigator.share) navigator.share(data).catch(() => {})
  }

  return (
    <Frame title="Профиль" onMenu={() => navigate('/menu')}>
      <div className="pad">
        <div className="profile-card">
          <div className="ava round">{CLIENT.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="pn">{CLIENT.name}</div>
            <div className="pp">{CLIENT.tgUser}</div>
          </div>
        </div>

        <button className="btn" onClick={shareNumber}><IcPhone size={18} /> Поделиться номером</button>

        <div className="menu-card" style={{ marginTop: 14 }}>
          <button className="mrow">
            <span className="mi"><IcPin size={20} /></span>
            <span className="ml">Локация</span>
            <span className="mchev"><IcChevR size={18} /></span>
          </button>
        </div>

        <div className="sec-title">Мы в Telegram</div>
        <div className="menu-card">
          {TG_CHANNELS.map((c) => (
            <a key={c.id} className="mrow" href={c.href} target="_blank" rel="noreferrer">
              <span className="mi"><IcSend size={20} /></span>
              <span className="ml">{c.name}</span>
              <span className="mchev"><IcChevR size={18} /></span>
            </a>
          ))}
        </div>

        <div className="menu-foot">{COMPANY.name}</div>
      </div>
    </Frame>
  )
}
