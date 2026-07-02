import { useNavigate } from 'react-router-dom'
import { Frame } from '../components/ui.jsx'
import { IcHome, IcCalCheck, IcUser, IcStar, IcGear, IcChevR, IcSun, IcMoon } from '../icons.jsx'
import { COMPANY, MY_BOOKINGS } from '../data.js'

// Бургер-меню: навигация по разделам + переключатель темы (без нижних вкладок)
export default function Menu({ theme }) {
  const navigate = useNavigate()

  const items = [
    { icon: IcHome, label: 'Главная', to: '/' },
    { icon: IcCalCheck, label: 'История записей', to: '/my', count: MY_BOOKINGS.length },
    { icon: IcUser, label: 'Профиль', to: '/profile' },
    { icon: IcStar, label: 'Отзывы и работы', to: '/reviews' },
    { icon: IcGear, label: 'Настройки', to: '/settings' },
  ]

  return (
    <Frame title="Меню" onBack={() => navigate('/')}>
      <div className="pad">
        <div className="menu-card">
          {items.map((it) => (
            <button key={it.to} className="mrow" onClick={() => navigate(it.to)}>
              <span className="mi"><it.icon size={20} /></span>
              <span className="ml">{it.label}</span>
              {it.count != null && <span className="mcount">{it.count}</span>}
              <span className="mchev"><IcChevR size={18} /></span>
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

        <div className="menu-foot">{COMPANY.name}</div>
      </div>
    </Frame>
  )
}
