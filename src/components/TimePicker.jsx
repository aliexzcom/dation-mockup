import { useState, useRef, useEffect } from 'react'
import { IcClock, IcChevron } from './icons.jsx'

const pad = (n) => String(n).padStart(2, '0')

// Выбор времени в стиле iPhone: два колеса (часы | минуты) с центральной подсветкой
export function TimePicker({ value, defaultValue, onChange, style, minuteStep = 5 }) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue || '')
  const val = isControlled ? value : internal
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const hCol = useRef(null)
  const mCol = useRef(null)

  const [hh, mm] = (val || '09:00').split(':')
  const hours = Array.from({ length: 24 }, (_, i) => pad(i))
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => pad(i * minuteStep))

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // центрируем выбранные значения при открытии
  useEffect(() => {
    if (!open) return
    const center = (col) => {
      const el = col?.querySelector('.tp-item.active')
      if (el && col) col.scrollTop = el.offsetTop - col.clientHeight / 2 + el.clientHeight / 2
    }
    const t = setTimeout(() => { center(hCol.current); center(mCol.current) }, 0)
    return () => clearTimeout(t)
  }, [open])

  const commit = (nh, nm) => {
    const v = `${nh}:${nm}`
    if (!isControlled) setInternal(v)
    if (onChange) onChange(v)
  }

  return (
    <div className="datepicker" ref={ref} style={style}>
      <button type="button" className={`dp-toggle ${open ? 'open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className="dp-ico"><IcClock size={16} /></span>
        <span className="dp-val">{val || 'чч:мм'}</span>
        <span className="chev" style={{ marginLeft: 'auto', color: 'var(--text-faint)', display: 'inline-flex' }}><IcChevron size={16} /></span>
      </button>
      {open && (
        <div className="dp-pop" style={{ width: 184 }}>
          <div className="tp-wheels">
            <div className="tp-col" ref={hCol}>
              {hours.map((h) => (
                <div key={h} className={`tp-item ${h === hh ? 'active' : ''}`} onClick={() => commit(h, mm)}>{h}</div>
              ))}
            </div>
            <span className="tp-colon">:</span>
            <div className="tp-col" ref={mCol}>
              {minutes.map((m) => (
                <div key={m} className={`tp-item ${m === mm ? 'active' : ''}`} onClick={() => commit(hh, m)}>{m}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
