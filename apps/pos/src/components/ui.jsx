import { IcMoon, IcSun, IcCheck } from '../icons.jsx'

export function ThemeToggle({ theme }) {
  return (
    <button className="icon-btn" onClick={theme.toggle} aria-label="Сменить тему">
      {theme.dark ? <IcSun /> : <IcMoon />}
    </button>
  )
}

export function Switch({ on, onClick }) {
  return <button className={'switch' + (on ? ' on' : '')} onClick={onClick} aria-pressed={on} />
}

export function Tick({ on }) {
  return <div className={'tick' + (on ? ' on' : '')}>{on && <IcCheck size={15} />}</div>
}

export function Badge({ cls, children }) {
  return <span className={'badge ' + cls}>{children}</span>
}
