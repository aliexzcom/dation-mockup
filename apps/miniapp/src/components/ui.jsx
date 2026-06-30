import { IcBack, IcStar, IcCheck, IcMoon, IcSun, IcMenu } from '../icons.jsx'

// Переключатель темы (иконка в шапке)
export function ThemeBtn({ theme }) {
  return (
    <button className="tbar-ico" onClick={theme.toggle} aria-label="Сменить тему">
      {theme.dark ? <IcSun /> : <IcMoon />}
    </button>
  )
}

// Рамка «телефона»: шапка (Telegram header) + прокручиваемое тело + опц. нижняя кнопка.
// Слева: кнопка «назад» (onBack), либо бургер-меню (onMenu), либо логотип.
export function Frame({ title, subtitle, onBack, onMenu, right, children, footer, scrollKey }) {
  return (
    <div className="phone">
      <div className="tbar">
        {onBack
          ? <button className="tbar-back" onClick={onBack} aria-label="Назад"><IcBack /></button>
          : onMenu
            ? <button className="tbar-back" onClick={onMenu} aria-label="Меню"><IcMenu /></button>
            : <div className="tbar-logo"><img src="/logo-mark.svg" alt="Dation" /></div>}
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
