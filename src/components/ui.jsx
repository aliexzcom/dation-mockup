import { useState, useRef, useEffect } from 'react'
import { IcSearch, IcClose, IcChevron } from './icons.jsx'

// ---------- Кнопка ----------
export function Button({ children, variant = 'primary', size, className = '', ...rest }) {
  const v = variant === 'primary' ? '' : variant
  return (
    <button className={`btn ${v} ${size === 'sm' ? 'sm' : ''} ${className}`} {...rest}>{children}</button>
  )
}

// ---------- Заголовок страницы ----------
export function PageHead({ crumbs, title, sub, actions }) {
  return (
    <div className="page-head">
      <div>
        {crumbs && <div className="crumbs">{crumbs}</div>}
        <div className="page-title">{title}</div>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  )
}

// ---------- Карточка ----------
export function Card({ title, actions, children, pad = true, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-head">
          <h3>{title}</h3>
          {actions && <div className="actions">{actions}</div>}
        </div>
      )}
      <div className={pad ? 'card-pad' : ''}>{children}</div>
    </div>
  )
}

// ---------- Stat-карточка ----------
export function Stat({ label, value, delta, dir }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className={`delta ${dir || 'up'}`}>{delta}</div>}
    </div>
  )
}

// ---------- Вкладки ----------
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <div key={t} className={`tab ${active === t ? 'active' : ''}`} onClick={() => onChange(t)}>{t}</div>
      ))}
    </div>
  )
}

export function useTabs(list) {
  const [active, setActive] = useState(list[0])
  return [active, setActive]
}

// ---------- Бейдж ----------
export function Badge({ children, color }) {
  return <span className={`badge ${color || ''}`}>{children}</span>
}

// ---------- Таблица ----------
export function Table({ columns, rows, renderRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>{columns.map((c, i) => {
            const isObj = c && typeof c === 'object'
            return <th key={i} className={isObj && c.num ? 'num' : ''}>{isObj ? c.label : c}</th>
          })}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length}><div className="empty"><p>Нет данных</p></div></td></tr>
          ) : rows.map((r, i) => renderRow(r, i))}
        </tbody>
      </table>
    </div>
  )
}

// ---------- Поля ----------
export function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>
}
export function Input(props) { return <input className="input" {...props} /> }
export function Textarea(props) { return <textarea className="input" rows={3} {...props} /> }
// Кастомный выпадающий список (вместо нативного select) — единый дизайн и шрифт
export function Select({ options = [], value, defaultValue, onChange, style, placeholder }) {
  const norm = options.map((o) => (o && typeof o === 'object' ? o : { value: o, label: o }))
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? norm[0]?.value)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = isControlled ? value : internal

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const pick = (v) => {
    if (!isControlled) setInternal(v)
    if (onChange) onChange({ target: { value: v } })
    setOpen(false)
  }

  const currentLabel = norm.find((o) => o.value === current)?.label ?? current ?? placeholder ?? ''

  return (
    <div className="dropdown" ref={ref} style={style}>
      <button type="button" className={`dropdown-toggle ${open ? 'open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className="dropdown-value">{currentLabel}</span>
        <span className="chev"><IcChevron size={16} /></span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {norm.map((o, i) => (
            <div key={i} className={`dropdown-item ${o.value === current ? 'active' : ''}`} onClick={() => pick(o.value)}>
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export function Switch({ on, onClick }) {
  return <div className={`switch ${on ? 'on' : ''}`} onClick={onClick} role="switch" aria-checked={on} />
}
export function Checkbox({ label, checked, onChange }) {
  return <label className="checkbox"><input type="checkbox" checked={!!checked} onChange={onChange} /><span>{label}</span></label>
}

// ---------- Поиск ----------
export function SearchInput({ placeholder = 'Поиск' }) {
  return <div className="search-sm"><IcSearch size={16} /><input placeholder={placeholder} /></div>
}

// ---------- Чипы-фильтры ----------
export function Chips({ items, active, onChange }) {
  return (
    <>{items.map((it) => (
      <span key={it} className={`chip ${active === it ? 'active' : ''}`} onClick={() => onChange && onChange(it)}>{it}</span>
    ))}</>
  )
}

// ---------- Пустое состояние ----------
export function Empty({ title = 'Пока пусто', text, action }) {
  return (
    <div className="empty">
      <h4>{title}</h4>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

// ---------- Drawer (правая панель) ----------
export function Drawer({ title, open, onClose, children, footer }) {
  if (!open) return null
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h3>{title}</h3>
          <div style={{ marginLeft: 'auto' }}>
            <button className="icon-btn" onClick={onClose}><IcClose size={18} /></button>
          </div>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </div>
  )
}

// ---------- Список ключ-значение ----------
export function KV({ items }) {
  return <div>{items.map(([k, v], i) => <div className="kv" key={i}><span className="k">{k}</span><span>{v}</span></div>)}</div>
}

export { IcChevron }
