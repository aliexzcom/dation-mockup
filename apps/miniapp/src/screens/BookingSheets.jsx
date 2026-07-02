import { useState } from 'react'
import { Sheet, Tick } from '../components/ui.jsx'
import { IcClock, IcStar, IcSearch, IcUser, IcPin, IcCheck, IcPhone } from '../icons.jsx'
import {
  BRANCHES, CATEGORIES, STAFF, SLOTS, BUSY, CLIENT,
  fmtPrice, fmtDur, fmtDateFull, fmtDateShort, fmtRating, nextDays,
} from '../data.js'

const DAYS = nextDays(14)
const ALL_SLOTS = [...SLOTS.morning, ...SLOTS.day, ...SLOTS.evening]

// ---------- Филиал ----------
export function BranchSheet({ branch, onPick, onClose }) {
  return (
    <Sheet title="Выберите филиал" onClose={onClose}>
      {BRANCHES.map((b) => (
        <button key={b.id} className={'pick' + (branch?.id === b.id ? ' sel' : '')} onClick={() => { onPick(b); onClose() }}>
          <div className="ava"><IcPin /></div>
          <div className="pick-body">
            <div className="pick-title">{b.name}</div>
            <div className="pick-meta">{b.addr} · {b.hours}</div>
          </div>
          <Tick on={branch?.id === b.id} />
        </button>
      ))}
    </Sheet>
  )
}

// ---------- Специалист ----------
export function SpecialistSheet({ master, services, onPick, onClose, footer }) {
  const ids = services.map((s) => s.id)
  const list = ids.length
    ? STAFF.filter((m) => m.any || m.services?.some((sid) => ids.includes(sid)))
    : STAFF

  return (
    <Sheet title="Выбрать специалиста" onClose={onClose} footer={footer}>
      {list.map((m) => (
        <button key={m.id} className={'spec-row' + (master?.id === m.id ? ' sel' : '')} onClick={() => onPick(m)}>
          <div className="spec-ava">{m.photo ? <img src={m.photo} alt="" /> : <IcUser />}</div>
          <div className="spec-body">
            <div className="spec-name">{m.name}</div>
            <div className="spec-role">{m.spec}</div>
            {!m.any && (
              <div className="spec-rate"><IcStar size={13} /> {fmtRating(m.rating)} <span className="dot">·</span> {m.reviews} отзывов</div>
            )}
          </div>
          <Tick on={master?.id === m.id} />
        </button>
      ))}
    </Sheet>
  )
}

// ---------- Услуги ----------
export function ServicesSheet({ master, services, onToggle, onClose, footer }) {
  const specific = master && !master.any
  const chips = specific
    ? [{ id: 'all', name: master.spec }]
    : CATEGORIES.map((c) => ({ id: c.id, name: c.name }))
  const [catId, setCatId] = useState(chips[0]?.id)
  const [q, setQ] = useState('')

  const activeId = chips.some((c) => c.id === catId) ? catId : chips[0]?.id
  const pool = specific
    ? CATEGORIES.flatMap((c) => c.services).filter((s) => master.services?.includes(s.id))
    : (CATEGORIES.find((c) => c.id === activeId)?.services || [])
  const items = pool.filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()))
  const ids = services.map((s) => s.id)

  return (
    <Sheet title="Выбрать услуги" onClose={onClose} footer={footer}>
      <div className="svc-search">
        <IcSearch size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Найти услугу" />
      </div>

      <div className="chip-row">
        {chips.map((c) => (
          <button key={c.id} className={'chip' + (c.id === activeId ? ' active' : '')} onClick={() => setCatId(c.id)}>{c.name}</button>
        ))}
      </div>

      <div className="svc-grid">
        {items.map((s) => {
          const on = ids.includes(s.id)
          return (
            <button key={s.id} className={'svc-card' + (on ? ' sel' : '')} onClick={() => onToggle(s)}>
              <div className="svc-photo" style={{ backgroundImage: `url(${s.photo})` }}>
                {on && <span className="svc-check"><IcCheck size={15} /></span>}
              </div>
              <div className="svc-name">{s.name}</div>
              <div className="svc-foot">
                <span className="svc-price">{fmtPrice(s.price)}</span>
                <span className="svc-dur">{fmtDur(s.dur)}</span>
              </div>
            </button>
          )
        })}
        {!items.length && <div className="note" style={{ gridColumn: '1 / -1' }}>Ничего не найдено.</div>}
      </div>
    </Sheet>
  )
}

// ---------- Дата и время ----------
export function DateTimeSheet({ date, time, onDate, onTime, onClose, footer }) {
  return (
    <Sheet title="Выбрать дату и время" onClose={onClose} footer={footer}>
      <div className="date-strip">
        {DAYS.map((d) => (
          <button key={d.key} className={'date-chip' + (date === d.key ? ' sel' : '')} onClick={() => { onDate(d.key); onTime(null) }}>
            <div className="wd">{d.wd}</div>
            <div className="dd">{d.dd}</div>
            <div className="mo">{d.mo}</div>
          </button>
        ))}
      </div>

      <div className="sec-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IcClock size={14} /> Доступное время</div>
      {date ? (
        <div className="slot-grid">
          {ALL_SLOTS.map((t) => {
            const off = BUSY.includes(t)
            return (
              <button key={t} className={'slot' + (off ? ' off' : '') + (time === t ? ' sel' : '')} disabled={off} onClick={() => onTime(t)}>{t}</button>
            )
          })}
        </div>
      ) : (
        <div className="note" style={{ marginTop: 12 }}>Выберите дату, чтобы увидеть свободное время.</div>
      )}
    </Sheet>
  )
}

// ---------- Подтверждение записи ----------
export function ConfirmSheet({ services, master, date, time, onClose, onDone }) {
  const total = services.reduce((s, x) => s + x.price, 0)

  const shareNumber = () => {
    const data = { title: 'Контакт', text: `${CLIENT.name}: ${CLIENT.phone}` }
    if (navigator.share) navigator.share(data).catch(() => {})
  }

  return (
    <Sheet
      title="Всё верно?"
      onClose={onClose}
      footer={<button className="btn" onClick={onDone}>Записаться</button>}
    >
      <div className="cf-card">
        <div className="cf-master">
          <div className="cf-ava">{master?.photo ? <img src={master.photo} alt="" /> : <IcUser />}</div>
          <div>
            <div className="cf-name">{master?.name}</div>
            <div className="cf-role">{master?.spec}</div>
          </div>
        </div>
        {services.map((s) => (
          <div key={s.id} className="cf-line"><span>{s.name}</span><span className="cf-amt">{fmtPrice(s.price)}</span></div>
        ))}
        <div className="cf-line"><span>{fmtDateShort(date)}</span><span className="cf-when">{time}</span></div>
        <div className="cf-line total"><span>Итого</span><span className="cf-amt">{fmtPrice(total)}</span></div>
      </div>

      <div className="cf-client"><IcUser size={18} /> <span>{CLIENT.name}</span></div>
      <button className="btn secondary" onClick={shareNumber}><IcPhone size={18} /> Поделиться номером</button>
    </Sheet>
  )
}

// ---------- Успех ----------
export function SuccessSheet({ services, master, branch, date, time, onMy, onClose }) {
  const total = services.reduce((s, x) => s + x.price, 0)
  return (
    <Sheet
      title="Готово"
      onClose={onClose}
      footer={<button className="btn" onClick={onMy}>Мои записи</button>}
    >
      <div className="center" style={{ padding: '6px 4px 2px' }}>
        <div className="success-ico"><IcCheck size={40} /></div>
        <h2 className="h-screen">Вы записаны!</h2>
        <p className="h-sub">Детали отправлены в Telegram. Напомним за день и за час до визита.</p>
      </div>
      <div className="summary" style={{ textAlign: 'left' }}>
        <div className="kv"><span className="k">Услуги</span><span className="v">{services.map((s) => s.name).join(', ')}</span></div>
        <div className="kv"><span className="k">Мастер</span><span className="v">{master?.name}</span></div>
        <div className="kv"><span className="k">Когда</span><span className="v">{fmtDateFull(date)}, {time}</span></div>
        <div className="kv"><span className="k">Филиал</span><span className="v">{branch?.name}</span></div>
        <div className="kv total"><span className="k">Итого</span><span className="v">{fmtPrice(total)}</span></div>
      </div>
    </Sheet>
  )
}
