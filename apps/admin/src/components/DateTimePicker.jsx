import { useState, useRef, useEffect } from 'react'
import { IcCalendar, IcArrowL, IcArrowR } from './icons.jsx'

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const pad = (n) => String(n).padStart(2, '0')
const parseDate = (v) => { if (!v) return null; const [y, m, d] = v.split('-').map(Number); return { y, m: m - 1, d } }
const toDateValue = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
const fmtRuShort = (v) => (v ? v.split('-').reverse().join('.') : 'дд.мм.гггг')

// Объединённый выбор даты и времени: календарь + колёса часов/минут (как у iPhone)
export function DateTimePicker({ date, time, onChange, style, minuteStep = 5 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const hCol = useRef(null)
  const mCol = useRef(null)
  const today = new Date()
  const sel = parseDate(date)
  const [view, setView] = useState(() => (sel ? { y: sel.y, m: sel.m } : { y: today.getFullYear(), m: today.getMonth() }))

  const [hh, mm] = (time || '09:00').split(':')
  const hours = Array.from({ length: 24 }, (_, i) => pad(i))
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => pad(i * minuteStep))

  useEffect(() => {
    if (!open) return
    if (sel) setView({ y: sel.y, m: sel.m })
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const center = (col) => { const el = col?.querySelector('.tp-item.active'); if (el && col) col.scrollTop = el.offsetTop - col.clientHeight / 2 + el.clientHeight / 2 }
    const t = setTimeout(() => { center(hCol.current); center(mCol.current) }, 0)
    return () => clearTimeout(t)
  }, [open])

  const shift = (delta) => setView((v) => {
    let m = v.m + delta, y = v.y
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    return { y, m }
  })

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isSel = (d) => sel && sel.y === view.y && sel.m === view.m && d === sel.d
  const isToday = (d) => view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate()

  const pickDay = (d) => onChange(toDateValue(view.y, view.m, d), time || '09:00')
  const pickTime = (nh, nm) => onChange(date || toDateValue(view.y, view.m, today.getDate()), `${nh}:${nm}`)

  return (
    <div className="datepicker" ref={ref} style={style}>
      <button type="button" className={`dp-toggle ${open ? 'open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className="dp-ico"><IcCalendar size={16} /></span>
        <span className="dp-val">{fmtRuShort(date)}{time ? `, ${time}` : ''}</span>
      </button>
      {open && (
        <div className="dp-pop" style={{ width: 272 }}>
          {/* Календарь */}
          <div className="dp-head">
            <button type="button" onClick={() => shift(-1)}><IcArrowL size={16} /></button>
            <span>{MONTHS[view.m]} {view.y}</span>
            <button type="button" onClick={() => shift(1)}><IcArrowR size={16} /></button>
          </div>
          <div className="dp-grid">{WEEKDAYS.map((w) => <span key={w} className="dp-wd">{w}</span>)}</div>
          <div className="dp-grid">
            {cells.map((d, i) => d
              ? <button key={i} type="button" className={`dp-cell ${isSel(d) ? 'selected' : ''} ${isToday(d) ? 'today' : ''}`} onClick={() => pickDay(d)}>{d}</button>
              : <span key={i} className="dp-cell empty" />)}
          </div>

          {/* Время */}
          <div className="dt-time-head">Время</div>
          <div className="tp-wheels" style={{ height: 132 }}>
            <div className="tp-col" ref={hCol} style={{ padding: '48px 0' }}>
              {hours.map((h) => <div key={h} className={`tp-item ${h === hh ? 'active' : ''}`} onClick={() => pickTime(h, mm)}>{h}</div>)}
            </div>
            <span className="tp-colon">:</span>
            <div className="tp-col" ref={mCol} style={{ padding: '48px 0' }}>
              {minutes.map((m) => <div key={m} className={`tp-item ${m === mm ? 'active' : ''}`} onClick={() => pickTime(hh, m)}>{m}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
