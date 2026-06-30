import { useNavigate } from 'react-router-dom'
import { IcBack, IcStar, IcCheck, IcMoon, IcSun, IcHome, IcCalCheck } from '../icons.jsx'

// Переключатель темы (иконка в шапке)
export function ThemeBtn({ theme }) {
  return (
    <button className="tbar-ico" onClick={theme.toggle} aria-label="Сменить тему">
      {theme.dark ? <IcSun /> : <IcMoon />}
    </button>
  )
}

// Рамка «телефона»: шапка (Telegram header) + прокручиваемое тело + опц. нижняя кнопка/таб-бар
export function Frame({ title, subtitle, onBack, right, children, footer, tabbar, scrollKey }) {
  return (
    <div className="phone">
      <div className="tbar">
        {onBack
          ? <button className="tbar-back" onClick={onBack} aria-label="Назад"><IcBack /></button>
          : <div className="tbar-logo">L</div>}
        <div className="tbar-title">
          <div className="t">{title}</div>
          {subtitle && <div className="s">{subtitle}</div>}
        </div>
        {right}
      </div>
      <div className={'scroll' + (footer ? ' with-mainbtn' : '')} key={scrollKey}>
        {children}
      </div>
      {footer && <div className="mainbtn">{footer}</div>}
      {tabbar}
    </div>
  )
}

// Нижняя навигация: Главная (домик) + Мои записи
export function TabBar({ active }) {
  const navigate = useNavigate()
  return (
    <div className="tabbar">
      <button className={'tabbar-item' + (active === 'home' ? ' active' : '')} onClick={() => navigate('/')}>
        <IcHome size={22} /><span>Главная</span>
      </button>
      <button className={'tabbar-item' + (active === 'my' ? ' active' : '')} onClick={() => navigate('/my')}>
        <IcCalCheck size={22} /><span>Мои записи</span>
      </button>
    </div>
  )
}

// Прогресс-бар шагов
export function Steps({ total, current }) {
  return (
    <div className="steps">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={'step-pip' + (i < current ? ' done' : i === current ? ' cur' : '')} />
      ))}
    </div>
  )
}

// Кружок-галочка выбора
export function Tick({ on }) {
  return <div className={'tick' + (on ? ' on' : '')}>{on && <IcCheck size={15} />}</div>
}

// Рейтинг звёздами
export function Stars({ value }) {
  if (value == null) return null
  return <span className="stars"><IcStar size={13} />{value.toFixed(1)}</span>
}

// Аватар с инициалами
export function Ava({ children, className = '' }) {
  return <div className={'ava ' + className}>{children}</div>
}
