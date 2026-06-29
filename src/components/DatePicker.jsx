import { useState, useRef, useEffect } from 'react'
import { IcCalendar, IcArrowL, IcArrowR } from './icons.jsx'

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const parse = (v) => {
  if (!v) return null
  const [y, m, d] = v.split('-').map(Number)
  return { y, m: m - 1, d }
}
const pad = (n) => String(n).padStart(2, '0')
const toValue = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
const fmtRu = (v) => (v ? v.split('-').reverse().join('.') : 'дд.мм.гггг')

// Кастомный календарь в стиле дизайна (вместо нативного input[type=date])
export function DatePicker({ value, defaultValue, onChange, style }) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue || '')
  const val = isControlled ? value : internal
  const sel = parse(val)
  const [open, setOpen] = useState(false)
  const today = new Date()
  const [view, setView] = useState(() => (sel ? { y: sel.y, m: sel.m } : { y: today.getFullYear(), m: today.getMonth() }))
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    if (sel) setView({ y: sel.y, m: sel.m })
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const shift = (delta) => setView((v) => {
    let m = v.m + delta, y = v.y
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    return { y, m }
  })

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // 0 = Пн
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isSel = (d) => sel && sel.y === view.y && sel.m === view.m && d === sel.d
  const isToday = (d) => view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate()

  const pick = (d) => {
    const v = toValue(view.y, view.m, d)
    if (!isControlled) setInternal(v)
    if (onChange) onChange(v)
    setOpen(false)
  }

  return (
    <div className="datepicker" ref={ref} style={style}>
      <button type="button" className={`dp-toggle ${open ? 'open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className="dp-ico"><IcCalendar size={16} /></span>
        <span className="dp-val">{fmtRu(val)}</span>
      </button>
      {open && (
        <div className="dp-pop">
          <div className="dp-head">
            <button type="button" onClick={() => shift(-1)}><IcArrowL size={16} /></button>
            <span>{MONTHS[view.m]} {view.y}</span>
            <button type="button" onClick={() => shift(1)}><IcArrowR size={16} /></button>
          </div>
          <div className="dp-grid">
            {WEEKDAYS.map((w) => <span key={w} className="dp-wd">{w}</span>)}
          </div>
          <div className="dp-grid">
            {cells.map((d, i) => d
              ? <button key={i} type="button" className={`dp-cell ${isSel(d) ? 'selected' : ''} ${isToday(d) ? 'today' : ''}`} onClick={() => pick(d)}>{d}</button>
              : <span key={i} className="dp-cell empty" />)}
          </div>
        </div>
      )}
    </div>
  )
}
