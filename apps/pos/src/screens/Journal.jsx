import { useMemo, useState } from 'react'
import { Tick, Badge } from '../components/ui.jsx'
import {
  IcClose, IcArrowL, IcArrowR, IcPlay, IcCheck, IcClock, IcPhone,
  IcCash, IcCard, IcWallet, IcReceipt, IcList, IcColumns,
} from '../icons.jsx'
import {
  TODAY_APPOINTMENTS, SERVICES, STAFF, STATUS, PAY_METHODS,
  fmtPrice, fmtDur, sumServices, staffById,
} from '../data.js'
import { formatUzbPhone, isUzbPhoneValid } from '../phone.js'

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'booked', label: 'Запланированы' },
  { key: 'in_progress', label: 'В работе' },
  { key: 'closed', label: 'Завершённые' },
]

// Колонки канбан-доски (по статусам — слева направо по флоу)
const COLUMNS = [
  { key: 'booked', label: 'Запланированы', dot: 'blue' },
  { key: 'in_progress', label: 'В работе', dot: 'amber' },
  { key: 'done', label: 'К оплате', dot: 'violet' },
  { key: 'paid', label: 'Оплачены', dot: 'green' },
]

const payIcon = { cash: IcCash, card: IcCard, wallet: IcWallet }

export default function Journal({ employee, creating, setCreating }) {
  const [appts, setAppts] = useState(TODAY_APPOINTMENTS)
  const [view, setView] = useState('list')      // 'list' | 'board'
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)   // запись в drawer
  const [payId, setPayId] = useState(null)      // запись в модалке оплаты

  const open = appts.find((a) => a.id === openId) || null
  const paying = appts.find((a) => a.id === payId) || null

  const shown = useMemo(() => appts.filter((a) => {
    if (filter === 'all') return true
    if (filter === 'closed') return a.status === 'done' || a.status === 'paid'
    return a.status === filter
  }), [appts, filter])

  const stats = useMemo(() => {
    const active = appts.filter((a) => a.status !== 'cancelled')
    return {
      count: active.length,
      revenue: appts.filter((a) => a.status === 'paid').reduce((s, a) => s + sumServices(a.services), 0),
      working: appts.filter((a) => a.status === 'in_progress').length,
      waiting: appts.filter((a) => a.status === 'booked').length,
    }
  }, [appts])

  const setStatus = (id, status) => setAppts((p) => p.map((a) => (a.id === id ? { ...a, status } : a)))
  const pay = (id, method) => {
    setAppts((p) => p.map((a) => (a.id === id ? { ...a, status: 'paid', paidMethod: method } : a)))
    setPayId(null); setOpenId(null)
  }
  const addAppt = (data) => {
    setAppts((p) => [...p, { ...data, id: 'n' + Date.now(), status: 'booked', source: 'POS' }])
    setCreating(false)
  }
  // Перетаскивание карточки в колонку: в «Оплачены» — открываем оплату, иначе меняем статус
  const moveAppt = (id, status) => {
    const a = appts.find((x) => x.id === id)
    if (!a || a.status === status) return
    if (status === 'paid') { setPayId(id); return }
    setStatus(id, status)
  }

  return (
    <>
      <div className="stat-row">
        <div className="stat"><div className="l">Записей сегодня</div><div className="v">{stats.count}</div></div>
        <div className="stat"><div className="l">Выручка</div><div className="v">{stats.revenue.toLocaleString('ru-RU')}</div></div>
        <div className="stat"><div className="l">В работе</div><div className="v">{stats.working}</div></div>
        <div className="stat"><div className="l">Ожидают</div><div className="v">{stats.waiting}</div></div>
      </div>

      <div className="jr-toolbar">
        <div className="date-nav">
          <button className="icon-btn"><IcArrowL size={18} /></button>
          <div className="lbl">Сегодня, 30 июня</div>
          <button className="icon-btn"><IcArrowR size={18} /></button>
        </div>
        {view === 'list' && (
          <div className="seg">
            {FILTERS.map((f) => (
              <button key={f.key} className={'seg-btn' + (filter === f.key ? ' active' : '')} onClick={() => setFilter(f.key)}>{f.label}</button>
            ))}
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div className="seg">
          <button className={'seg-btn' + (view === 'list' ? ' active' : '')} onClick={() => setView('list')}><IcList size={16} /> Список</button>
          <button className={'seg-btn' + (view === 'board' ? ' active' : '')} onClick={() => setView('board')}><IcColumns size={16} /> Канбан</button>
        </div>
      </div>

      {view === 'board' ? (
        <Kanban appts={appts} onOpen={setOpenId} onMove={moveAppt} />
      ) : shown.length === 0 ? (
        <div className="empty">
          <div className="ei"><IcClock size={30} /></div>
          <h4>Записей нет</h4>
          <p className="muted">В этой вкладке пока пусто.</p>
        </div>
      ) : (
        <div className="appt-list">
          {shown.map((a) => <ApptRow key={a.id} a={a} onClick={() => setOpenId(a.id)} />)}
        </div>
      )}

      {open && (
        <ApptDrawer
          a={open} onClose={() => setOpenId(null)}
          onStart={() => setStatus(open.id, 'in_progress')}
          onFinish={() => setStatus(open.id, 'done')}
          onCancel={() => { setStatus(open.id, 'cancelled'); setOpenId(null) }}
          onPay={() => setPayId(open.id)}
        />
      )}

      {creating && <CreateDrawer employee={employee} onClose={() => setCreating(false)} onSave={addAppt} />}

      {paying && <PaymentModal a={paying} onClose={() => setPayId(null)} onPaid={(m) => pay(paying.id, m)} />}
    </>
  )
}

function ApptRow({ a, onClick }) {
  const st = STATUS[a.status]
  const master = staffById(a.masterId)
  return (
    <div className="appt" onClick={onClick}>
      <div className="appt-time">
        <div className="hh">{a.time}</div>
        <div className="dd">{fmtDur(a.services.reduce((s, x) => s + (SERVICES.find((v) => v.id === x.id)?.dur || 0), 0))}</div>
      </div>
      <div className="appt-main">
        <div className="appt-client">{a.client.name}</div>
        <div className="appt-meta">{master?.name} · {a.source}</div>
        <div>{a.services.map((s) => <span key={s.id} className="svc-chip">{s.name}</span>)}</div>
      </div>
      <div className="appt-side">
        <Badge cls={st.cls}>{st.label}</Badge>
        <div className="appt-total">{fmtPrice(sumServices(a.services))}</div>
      </div>
    </div>
  )
}

function Kanban({ appts, onOpen, onMove }) {
  const [overCol, setOverCol] = useState(null)
  const [dragId, setDragId] = useState(null)

  const drop = (e, colKey) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    setOverCol(null); setDragId(null)
    if (id) onMove(id, colKey)
  }

  return (
    <div className="board">
      {COLUMNS.map((col) => {
        const items = appts.filter((a) => a.status === col.key)
        return (
          <div key={col.key}
            className={'board-col' + (overCol === col.key ? ' over' : '')}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.key) }}
            onDragLeave={(e) => { if (e.currentTarget === e.target) setOverCol(null) }}
            onDrop={(e) => drop(e, col.key)}>
            <div className="board-col-head">
              <span className={'kdot ' + col.dot} /> {col.label}
              <span className="cnt">{items.length}</span>
            </div>
            <div className="board-cards">
              {items.length === 0
                ? <div className="kb-empty">Перетащите запись сюда</div>
                : items.map((a) => (
                  <KbCard key={a.id} a={a} dragging={dragId === a.id}
                    onOpen={() => onOpen(a.id)}
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', a.id); e.dataTransfer.effectAllowed = 'move'; setDragId(a.id) }}
                    onDragEnd={() => { setDragId(null); setOverCol(null) }} />
                ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KbCard({ a, dragging, onOpen, onDragStart, onDragEnd }) {
  const master = staffById(a.masterId)
  return (
    <div className={'kb-card' + (dragging ? ' dragging' : '')} draggable
      onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onOpen}>
      <div className="kb-top">
        <span className="hh">{a.time}</span>
        <span className="src">{a.source}</span>
      </div>
      <div className="kb-client">{a.client.name}</div>
      <div className="kb-master">{master?.name}</div>
      <div>{a.services.map((s) => <span key={s.id} className="svc-chip">{s.name}</span>)}</div>
      <div className="kb-foot">
        <span className="kb-total">{fmtPrice(sumServices(a.services))}</span>
      </div>
    </div>
  )
}

function ApptDrawer({ a, onClose, onStart, onFinish, onCancel, onPay }) {
  const st = STATUS[a.status]
  const master = staffById(a.masterId)
  const total = sumServices(a.services)
  return (
    <div className="overlay right" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h3>Запись · {a.time}</h3>
          <div style={{ flex: 1 }} />
          <Badge cls={st.cls}>{st.label}</Badge>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть"><IcClose size={18} /></button>
        </div>
        <div className="drawer-body">
          <div className="sec-title">Клиент</div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{a.client.name}</div>
          <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <IcPhone size={15} /> {a.client.phone} · {a.source}
          </div>

          <div className="sec-title">Услуги</div>
          <div className="summary">
            {a.services.map((s) => (
              <div key={s.id} className="kv"><span className="k">{s.name}</span><span className="v">{fmtPrice(s.price)}</span></div>
            ))}
            <div className="kv total"><span className="k">Итого</span><span className="v">{fmtPrice(total)}</span></div>
          </div>

          <div className="sec-title">Мастер</div>
          <div className="pick" style={{ cursor: 'default' }}>
            <div className="who-ava" style={{ background: master?.color, width: 38, height: 38, fontSize: 14 }}>{master?.initials}</div>
            <div className="pb"><div className="pt">{master?.name}</div><div className="pm">{master?.role}</div></div>
          </div>

          {a.status === 'paid' && (
            <div className="note" style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcReceipt size={16} /> Оплачено: {PAY_METHODS.find((m) => m.id === a.paidMethod)?.label || '—'}
            </div>
          )}
        </div>

        <div className="drawer-foot">
          {a.status === 'booked' && <>
            <button className="btn ghost" onClick={onCancel}>Отменить</button>
            <button className="btn secondary" onClick={onPay}>Оплатить</button>
            <button className="btn" onClick={onStart}><IcPlay size={16} /> Начать</button>
          </>}
          {a.status === 'in_progress' && <>
            <button className="btn secondary" onClick={onPay}>Оплатить</button>
            <button className="btn" onClick={onFinish}><IcCheck size={16} /> Завершить</button>
          </>}
          {a.status === 'done' && (
            <button className="btn success" onClick={onPay}><IcCash size={16} /> Оплатить {fmtPrice(total)}</button>
          )}
          {(a.status === 'paid' || a.status === 'cancelled') && (
            <button className="btn ghost" onClick={onClose}>Закрыть</button>
          )}
        </div>
      </div>
    </div>
  )
}

function CreateDrawer({ employee, onClose, onSave }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [picked, setPicked] = useState([])     // id услуг
  const [masterId, setMasterId] = useState(employee.id)
  const [time, setTime] = useState('18:00')

  const services = SERVICES.filter((s) => picked.includes(s.id))
  const total = sumServices(services)
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const masters = STAFF.filter((s) => s.posAccess)
  const valid = name.trim() && isUzbPhoneValid(phone) && picked.length && masterId && time

  const save = () => {
    if (!valid) return
    onSave({
      time, masterId,
      client: { name: name.trim(), phone },
      services: services.map((s) => ({ id: s.id, name: s.name, price: s.price })),
    })
  }

  return (
    <div className="overlay right" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h3>Новая запись</h3>
          <div style={{ flex: 1 }} />
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть"><IcClose size={18} /></button>
        </div>
        <div className="drawer-body">
          <div className="sec-title">Клиент</div>
          <div className="field"><label>Имя</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя клиента" />
          </div>
          <div className="field"><label>Телефон</label>
            <input className="input" value={phone} inputMode="tel"
              onChange={(e) => setPhone(formatUzbPhone(e.target.value))} placeholder="+998 90 123 45 67" />
          </div>

          <div className="sec-title">Услуги</div>
          {SERVICES.map((s) => (
            <button key={s.id} className={'pick' + (picked.includes(s.id) ? ' sel' : '')} onClick={() => toggle(s.id)}>
              <Tick on={picked.includes(s.id)} />
              <div className="pb"><div className="pt">{s.name}</div><div className="pm">{fmtDur(s.dur)}</div></div>
              <div className="pr">{fmtPrice(s.price)}</div>
            </button>
          ))}

          <div className="sec-title">Мастер</div>
          {masters.map((m) => (
            <button key={m.id} className={'pick' + (masterId === m.id ? ' sel' : '')} onClick={() => setMasterId(m.id)}>
              <div className="who-ava" style={{ background: m.color, width: 36, height: 36, fontSize: 13 }}>{m.initials}</div>
              <div className="pb"><div className="pt">{m.name}</div><div className="pm">{m.role}</div></div>
              <Tick on={masterId === m.id} />
            </button>
          ))}

          <div className="sec-title">Время</div>
          <div className="field">
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn ghost" onClick={onClose}>Отмена</button>
          <button className="btn" disabled={!valid} onClick={save}>
            {total ? `Создать · ${fmtPrice(total)}` : 'Создать запись'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PaymentModal({ a, onClose, onPaid }) {
  const total = sumServices(a.services)
  const [method, setMethod] = useState(null)
  const [received, setReceived] = useState(0)

  const isCash = method === 'cash'
  const change = Math.max(0, received - total)
  const canPay = method && (!isCash || received >= total)
  const quick = [total, Math.ceil(total / 100000) * 100000, total + 100000]

  return (
    <div className="overlay center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Оплата</h3>
          <div style={{ flex: 1 }} />
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть"><IcClose size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="cash-display">
            <div className="lbl">{a.client.name} · к оплате</div>
            <div className="big">{fmtPrice(total)}</div>
          </div>

          <div className="sec-title" style={{ marginTop: 0 }}>Способ оплаты</div>
          <div className="pay-grid">
            {PAY_METHODS.map((m) => {
              const Icon = payIcon[m.icon]
              return (
                <button key={m.id} className={'pay-tile' + (method === m.id ? ' sel' : '')}
                  onClick={() => { setMethod(m.id); setReceived(0) }}>
                  <Icon size={26} /> {m.label}
                </button>
              )
            })}
          </div>

          {isCash && (
            <>
              <div className="sec-title">Получено</div>
              <div className="cash-display">
                <div className="big">{received.toLocaleString('ru-RU')}</div>
                <div className="lbl">Сдача: {change.toLocaleString('ru-RU')} сум</div>
              </div>
              <div className="quick-cash">
                {quick.map((q, i) => (
                  <button key={i} onClick={() => setReceived(q)}>{q.toLocaleString('ru-RU')}</button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={onClose}>Отмена</button>
          <button className="btn success" disabled={!canPay} onClick={() => onPaid(method)}>
            <IcCheck size={16} /> Провести оплату
          </button>
        </div>
      </div>
    </div>
  )
}
