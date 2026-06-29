import { useState, useRef, useEffect } from 'react'
import { IcSearch } from './icons.jsx'

// Поиск и мультивыбор услуг (value — массив названий)
export function ServicePicker({ options = [], value = [], onChange, placeholder = 'Поиск услуги' }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const matches = options.filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()) && !value.includes(s.name))
  const add = (name) => { onChange([...value, name]); setQ(''); setOpen(false) }
  const remove = (name) => onChange(value.filter((x) => x !== name))

  return (
    <div className="dropdown" ref={ref}>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {value.map((s, i) => (
            <span key={i} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {s}
              <span style={{ cursor: 'pointer', fontWeight: 700 }} onClick={() => remove(s)}>×</span>
            </span>
          ))}
        </div>
      )}
      <div className="search-sm" style={{ width: '100%' }}>
        <IcSearch size={16} />
        <input placeholder={placeholder} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} />
      </div>
      {open && (
        <div className="dropdown-menu" style={{ maxHeight: 240, overflowY: 'auto' }}>
          {matches.map((s, i) => (
            <div key={i} className="dropdown-item" onClick={() => add(s.name)} style={{ whiteSpace: 'normal' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontWeight: 500 }}>{s.name}</span>
                {s.price && <span className="small muted">{s.price}</span>}
              </div>
            </div>
          ))}
          {matches.length === 0 && <div className="dropdown-item muted">Услуга не найдена</div>}
        </div>
      )}
    </div>
  )
}
