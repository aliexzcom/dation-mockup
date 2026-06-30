import { useNavigate } from 'react-router-dom'
import { Frame, Ava } from '../components/ui.jsx'
import { IcCalCheck, IcGear, IcShare, IcChevR } from '../icons.jsx'
import { CLIENT, COMPANY, MY_BOOKINGS } from '../data.js'

// Меню (открывается бургером сверху-слева): профиль + разделы
export default function Menu() {
  const navigate = useNavigate()

  const share = () => {
    const data = { title: COMPANY.name, text: `Записывайтесь онлайн в ${COMPANY.name}`, url: window.location.origin }
    if (navigator.share) navigator.share(data).catch(() => {})
  }

  return (
    <Frame title="Профиль" onBack={() => navigate('/')}>
      <div className="pad">
        <div className="profile-card">
          <Ava>{CLIENT.initials}</Ava>
          <div style={{ minWidth: 0 }}>
            <div className="pn">{CLIENT.name}</div>
            <div className="pp">{CLIENT.phone}</div>
          </div>
        </div>

        <div className="menu-card">
          <button className="mrow" onClick={() => navigate('/my')}>
            <span className="mi"><IcCalCheck size={20} /></span>
            <span className="ml">История посещений</span>
            <span className="mcount">{MY_BOOKINGS.length}</span>
            <span className="mchev"><IcChevR size={18} /></span>
          </button>
          <button className="mrow" onClick={() => navigate('/settings')}>
            <span className="mi"><IcGear size={20} /></span>
            <span className="ml">Настройки</span>
            <span className="mchev"><IcChevR size={18} /></span>
          </button>
          <button className="mrow" onClick={share}>
            <span className="mi"><IcShare size={20} /></span>
            <span className="ml">Поделиться с друзьями</span>
            <span className="mchev"><IcChevR size={18} /></span>
          </button>
        </div>

        <div className="menu-foot">{COMPANY.name}</div>
      </div>
    </Frame>
  )
}
