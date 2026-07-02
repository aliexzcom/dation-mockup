import { IcBack, IcStar, IcCheck, IcMenu, IcClose } from '../icons.jsx'

// Рамка «телефона»: шапка (Telegram header) + прокручиваемое тело + опц. нижняя кнопка.
// Слева: кнопка «назад» (onBack) либо логотип. Справа: бургер-меню (onMenu) либо right.
export function Frame({ title, subtitle, onBack, onMenu, right, children, footer, scrollKey }) {
  return (
    <div className="phone">
      <div className="tbar">
        {onBack
          ? <button className="tbar-back" onClick={onBack} aria-label="Назад"><IcBack /></button>
          : <div className="tbar-logo"><img src="/logo-mark.svg" alt="Dation" /></div>}
        <div className="tbar-title">
          <div className="t">{title}</div>
          {subtitle && <div className="s">{subtitle}</div>}
        </div>
        {onMenu
          ? <button className="tbar-ico" onClick={onMenu} aria-label="Меню"><IcMenu /></button>
          : right}
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

// Нижняя шторка (bottom-sheet): затемнение + панель с ручкой, заголовком и крестиком.
// footer — опциональная закреплённая кнопка снизу.
export function Sheet({ title, onClose, children, footer }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        <div className="sheet-head">
          <h3>{title}</h3>
          <button className="sheet-x" onClick={onClose} aria-label="Закрыть"><IcClose size={18} /></button>
        </div>
        <div className={'sheet-body' + (footer ? ' with-foot' : '')}>{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  )
}
