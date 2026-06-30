import { useState, useEffect, useRef } from 'react'
import { PageHead, Button, Segmented, Drawer, Field, Input, Select, Card, Badge, Table } from '../components/ui.jsx'
import { DateTimePicker } from '../components/DateTimePicker.jsx'
import { IcArrowL, IcArrowR, IcPlus, IcSearch } from '../components/icons.jsx'

// п. 4.5 — статусы визита
const STATUSES = {
  wait:    { label: 'Ожидает подтверждения', color: 'amber', c: '#FEF3C7', b: '#F59E0B' },
  conf:    { label: 'Подтверждён',           color: 'blue',  c: '#DBEAFE', b: '#3B82F6' },
  came:    { label: 'Клиент пришёл',         color: '',      c: '#EDE9FE', b: '#7C3AED' },
  done:    { label: 'Услуга оказана',        color: 'green', c: '#DCFCE7', b: '#16A34A' },
  noshow:  { label: 'Не пришёл (no-show)',   color: 'red',   c: '#FEE2E2', b: '#EF4444' },
  cancel:  { label: 'Отменён',               color: 'gray',  c: '#F3F4F6', b: '#9CA3AF' },
}

const STAFF = [
  { id: 1, name: 'Анна Морозова', role: 'Парикмахер-стилист', ini: 'АМ' },
  { id: 2, name: 'Игорь Лебедев', role: 'Барбер', ini: 'ИЛ' },
  { id: 3, name: 'Светлана Котова', role: 'Мастер маникюра', ini: 'СК' },
  { id: 4, name: 'Дмитрий Орлов', role: 'Косметолог', ini: 'ДО' },
]

const HOURS = Array.from({ length: 12 }, (_, i) => 9 + i) // 09:00–20:00
const START_HOUR = 9
const HOUR_H = 84   // высота часа, px
const HEADER_H = 56 // высота шапки колонки сотрудника
const GRID_H = HOURS.length * HOUR_H
const fmtTimeShort = (t) => { const h = Math.floor(t); const m = Math.round((t - h) * 60); return m ? `${h}:${String(m).padStart(2, '0')}` : `${h}:00` }

// Записи: staffId, час начала, длительность (в часах), клиент, услуга, статус
const INITIAL_APPTS = [
  { staff: 1, start: 9.5, dur: 1, client: 'Мария П.', service: 'Стрижка + укладка', status: 'done', src: 'Mini App' },
  { staff: 1, start: 12, dur: 1.5, client: 'Ольга К.', service: 'Окрашивание', status: 'came', src: 'Телефон' },
  { staff: 1, start: 16, dur: 1, client: 'Елена С.', service: 'Стрижка', status: 'conf', src: 'Mini App' },
  { staff: 2, start: 10, dur: 0.75, client: 'Артём Б.', service: 'Мужская стрижка', status: 'done', src: 'Mini App' },
  { staff: 2, start: 13, dur: 0.75, client: 'Павел Н.', service: 'Стрижка бороды', status: 'wait', src: 'Mini App' },
  { staff: 2, start: 15, dur: 1, client: 'Сергей Д.', service: 'Стрижка + борода', status: 'conf', src: 'Реклама' },
  { staff: 3, start: 9, dur: 1.5, client: 'Дарья Л.', service: 'Маникюр + покрытие', status: 'came', src: 'Телефон' },
  { staff: 3, start: 14, dur: 2, client: 'Ксения В.', service: 'Наращивание', status: 'conf', src: 'Mini App' },
  { staff: 4, start: 11, dur: 1, client: 'Инна Р.', service: 'Чистка лица', status: 'noshow', src: 'Mini App' },
  { staff: 4, start: 17, dur: 1.5, client: 'Алёна М.', service: 'Пилинг', status: 'cancel', src: 'Mini App' },
]

export default function Journal() {
  const [view, setView] = useState('День')
  const [drawer, setDrawer] = useState(null) // null | 'new' | appt
  const [appts, setAppts] = useState(INITIAL_APPTS)
  const [payAppt, setPayAppt] = useState(null)
  const [prefill, setPrefill] = useState(null) // {staffName, time} — клик по пустой ячейке
  const [date, setDate] = useState(new Date(2026, 5, 24)) // «сегодня» в макете — 24 июня 2026

  const shiftDate = (delta) => setDate((prev) => {
    const n = new Date(prev)
    n.setDate(n.getDate() + delta)
    return n
  })
  const dateLabel = (() => {
    const s = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).replace(/\s*г\.$/, '')
    return s.charAt(0).toUpperCase() + s.slice(1)
  })()

  const handleSave = (appt, pay) => {
    setAppts((prev) => [...prev, appt])
    setDrawer(null)
    if (pay) setPayAppt(appt)
  }

  // Клик по свободному месту в сетке — новая запись с подстановкой сотрудника и времени
  const handleNewAt = (staffId, startHour) => {
    const staffName = STAFF.find((s) => s.id === staffId)?.name || STAFF[0].name
    setPrefill({ staffName, time: hourToTime(startHour) })
    setDrawer('new')
  }

  return (
    <>
      <PageHead
        crumbs="Журнал записей"
        title="Журнал записей"
        sub="Календарь записей по сотрудникам и ресурсам: создание, перенос и обработка визитов."
        actions={<Button onClick={() => { setPrefill(null); setDrawer('new') }}><IcPlus size={16} /> Новая запись</Button>}
      />

      {/* Виды: День / Неделя / Месяц / Список (п. 4.2) */}
      <div style={{ marginBottom: 16 }}>
        <Segmented items={['День', 'Неделя', 'Месяц', 'Список записей']} active={view} onChange={setView} />
      </div>

      {/* Панель управления: навигация по датам, режим, шаг времени (п. 4.3) */}
      <div className="toolbar">
        <Button variant="ghost" size="sm" onClick={() => shiftDate(-1)}><IcArrowL size={16} /></Button>
        <strong style={{ minWidth: 210, textAlign: 'center' }}>{dateLabel}</strong>
        <Button variant="ghost" size="sm" onClick={() => shiftDate(1)}><IcArrowR size={16} /></Button>
      </div>

      {view === 'Список записей' ? <ListView appts={appts} onOpen={setDrawer} /> : <DayGrid appts={appts} onOpen={setDrawer} onNew={handleNewAt} />}

      <AppointmentDrawer open={!!drawer} appt={drawer === 'new' ? null : drawer} prefill={drawer === 'new' ? prefill : null} onClose={() => setDrawer(null)} onSave={handleSave} />

      <PaymentDrawer appt={payAppt} open={!!payAppt} onClose={() => setPayAppt(null)} />
    </>
  )
}

function DayGrid({ appts, onOpen, onNew }) {
  return (
    <Card pad={false}>
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {/* Шкала времени */}
        <div style={{ width: 56, flexShrink: 0, borderRight: '1px solid var(--border)' }}>
          <div style={{ height: HEADER_H, borderBottom: '1px solid var(--border)' }} />
          {HOURS.map((h) => (
            <div key={h} style={{ height: HOUR_H, padding: '5px 8px 0', fontSize: 11.5, color: 'var(--text-faint)', textAlign: 'right' }}>{h}:00</div>
          ))}
        </div>

        {/* Колонки сотрудников */}
        {STAFF.map((s) => (
          <div key={s.id} style={{ flex: 1, minWidth: 175, borderRight: '1px solid var(--border)' }}>
            {/* шапка сотрудника */}
            <div style={{ height: HEADER_H, padding: '0 12px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 9, alignItems: 'center' }}>
              <div className="avatar-sm">{s.ini}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div className="small faint" style={{ whiteSpace: 'nowrap' }}>{s.role}</div>
              </div>
            </div>
            {/* тело колонки: линии часов + записи поверх */}
            <div style={{ position: 'relative', height: GRID_H }}>
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  onClick={(e) => {
                    // 15-минутный шаг по вертикальной позиции клика внутри часа
                    const q = Math.min(3, Math.max(0, Math.floor(e.nativeEvent.offsetY / (HOUR_H / 4))))
                    onNew(s.id, h + q * 0.25)
                  }}
                  title="Создать запись"
                  style={{ position: 'absolute', left: 0, right: 0, top: i * HOUR_H, height: HOUR_H, borderBottom: '1px solid var(--border)', background: i % 2 ? 'var(--bg-soft)' : 'var(--panel)', cursor: 'pointer' }}
                />
              ))}
              {appts.filter((a) => a.staff === s.id).map((a, i) => (
                <ApptCell key={i} appt={a} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ApptCell({ appt, onOpen }) {
  const st = STATUSES[appt.status]
  const top = (appt.start - START_HOUR) * HOUR_H
  const height = appt.dur * HOUR_H - 5
  return (
    <div
      className="appt"
      onClick={() => onOpen(appt)}
      title="Открыть запись"
      style={{
        position: 'absolute', left: 5, right: 5, top: top + 2, height,
        background: st.c, borderLeft: `3px solid ${st.b}`, borderRadius: 8,
        padding: '6px 9px', cursor: 'pointer', overflow: 'hidden',
      }}>
      <div style={{ fontSize: 11, color: '#5B6472', fontWeight: 600 }}>{fmtTimeShort(appt.start)}–{fmtTimeShort(appt.start + appt.dur)}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.client}</div>
      {appt.service.split(' + ').map((s, i) => (
        <div key={i} className="small" style={{ color: '#475569', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>
      ))}
    </div>
  )
}

function ListView({ appts, onOpen }) {
  return (
    <Card pad={false}>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead><tr><th>Время</th><th>Клиент</th><th>Услуга</th><th>Сотрудник</th><th>Источник</th><th>Статус</th></tr></thead>
          <tbody>
            {appts.map((a, i) => {
              const s = STAFF.find(x => x.id === a.staff)
              const h = Math.floor(a.start); const m = (a.start - h) * 60
              return (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onOpen(a)}>
                  <td>{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}</td>
                  <td style={{ fontWeight: 600 }}>{a.client}</td>
                  <td>{a.service}</td>
                  <td>{s.name}</td>
                  <td><span className="small muted">{a.src}</span></td>
                  <td><Badge color={STATUSES[a.status].color}>{STATUSES[a.status].label}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// длительность: подпись -> часы
const DURATIONS = [['30 мин', 0.5], ['45 мин', 0.75], ['1 ч', 1], ['1 ч 30 мин', 1.5], ['2 ч', 2], ['3 ч', 3]]
const statusKeyByLabel = (label) => Object.keys(STATUSES).find((k) => STATUSES[k].label === label) || 'wait'
const labelByDur = (dur) => (DURATIONS.find(([, h]) => h === dur)?.[0]) || '1 ч'
const hourToTime = (start) => {
  const h = Math.floor(start); const m = Math.round((start - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
const timeToHour = (t) => { const [h, m] = (t || '10:00').split(':').map(Number); return h + (m || 0) / 60 }

const EMPTY_APPT = {
  client: '', date: '2026-06-24', time: '10:00', staffName: STAFF[0].name,
  resource: 'Кресло 1', service: '', duration: '1 ч', discount: '',
  status: STATUSES.wait.label, src: 'Telegram Mini App', comment: '', notify: true,
}

// Клиентская база для поиска при создании записи
const CLIENT_BASE = [
  { name: 'Мария Петрова', phone: '+7 900 123-45-67' },
  { name: 'Ольга Кузнецова', phone: '+7 910 234-56-78' },
  { name: 'Елена Смирнова', phone: '+7 920 345-67-89' },
  { name: 'Артём Белов', phone: '+7 930 456-78-90' },
  { name: 'Дарья Лебедева', phone: '+7 940 567-89-01' },
  { name: 'Светлана Новикова', phone: '+7 950 678-90-12' },
  { name: 'Инна Рыжова', phone: '+7 960 789-01-23' },
  { name: 'Павел Морозов', phone: '+7 970 890-12-34' },
]

// Поле поиска клиента с выпадающим списком
function ClientSearch({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const q = value.trim().toLowerCase()
  const matches = q
    ? CLIENT_BASE.filter((c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')))
    : CLIENT_BASE

  return (
    <div className="dropdown" ref={ref}>
      <div className="search-sm" style={{ width: '100%' }}>
        <IcSearch size={16} />
        <input
          placeholder="Поиск клиента по имени или телефону"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className="dropdown-menu">
          {/* Закреплённая сверху кнопка — всегда видна */}
          <div className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--violet)', fontWeight: 600, borderBottom: '1px solid var(--border)', marginBottom: 2 }} onClick={() => setOpen(false)}>
            <IcPlus size={14} /> Новый клиент
          </div>
          {/* Прокручиваемый список клиентов */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {matches.map((c, i) => (
              <div key={i} className="dropdown-item" onClick={() => { onChange(c.name); setOpen(false) }} style={{ whiteSpace: 'normal' }}>
                <div style={{ fontWeight: 500 }}>{c.name}</div>
                <div className="small muted">{c.phone}</div>
              </div>
            ))}
            {matches.length === 0 && <div className="dropdown-item muted">Не найдено</div>}
          </div>
        </div>
      )}
    </div>
  )
}

// База услуг для поиска при создании записи
const SERVICE_BASE = [
  { name: 'Женская стрижка', price: '2 000 ₽', dur: '1 ч' },
  { name: 'Мужская стрижка', price: '1 200 ₽', dur: '45 мин' },
  { name: 'Стрижка бороды', price: '800 ₽', dur: '30 мин' },
  { name: 'Окрашивание', price: '4 500 ₽', dur: '2 ч' },
  { name: 'Балаяж / Омбре', price: '7 000 ₽', dur: '3 ч' },
  { name: 'Маникюр + покрытие', price: '2 200 ₽', dur: '1 ч 30 мин' },
  { name: 'Педикюр', price: '2 500 ₽', dur: '1 ч 30 мин' },
  { name: 'Наращивание ногтей', price: '4 500 ₽', dur: '2 ч' },
  { name: 'Чистка лица', price: '3 500 ₽', dur: '1 ч' },
  { name: 'Укладка', price: '900 ₽', dur: '45 мин' },
]

// Длительность услуг -> минуты, сумма, подпись
const parseDurToMin = (str) => {
  let min = 0
  const h = String(str).match(/(\d+)\s*ч/); if (h) min += +h[1] * 60
  const m = String(str).match(/(\d+)\s*мин/); if (m) min += +m[1]
  return min
}
const DUR_MIN = Object.fromEntries(SERVICE_BASE.map((s) => [s.name, parseDurToMin(s.dur)]))
const sumServiceMin = (service) => (service ? service.split(' + ').filter(Boolean) : []).reduce((sum, n) => sum + (DUR_MIN[n] || 0), 0)

// Поиск и мультивыбор услуг (значение — строка «X + Y»)
function ServiceSearch({ value, onChange }) {
  const selected = value ? value.split(' + ').filter(Boolean) : []
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const matches = SERVICE_BASE.filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()) && !selected.includes(s.name))
  const add = (name) => { onChange([...selected, name].join(' + ')); setQ(''); setOpen(false) }
  const remove = (name) => onChange(selected.filter((x) => x !== name).join(' + '))

  return (
    <div className="dropdown" ref={ref}>
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {selected.map((s, i) => (
            <span key={i} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {s}
              <span style={{ cursor: 'pointer', fontWeight: 700 }} onClick={() => remove(s)}>×</span>
            </span>
          ))}
        </div>
      )}
      <div className="search-sm" style={{ width: '100%' }}>
        <IcSearch size={16} />
        <input placeholder="Поиск услуги" value={q} onChange={(e) => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} />
      </div>
      {open && (
        <div className="dropdown-menu" style={{ maxHeight: 240, overflowY: 'auto' }}>
          {matches.map((s, i) => (
            <div key={i} className="dropdown-item" onClick={() => add(s.name)} style={{ whiteSpace: 'normal' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontWeight: 500 }}>{s.name}</span>
                <span className="small muted">{s.price}</span>
              </div>
              <div className="small faint">{s.dur}</div>
            </div>
          ))}
          {matches.length === 0 && <div className="dropdown-item muted">Услуга не найдена</div>}
        </div>
      )}
    </div>
  )
}

const parsePrice = (p) => Number(String(p).replace(/[^\d]/g, '')) || 0
const fmtMoney = (n) => n.toLocaleString('ru-RU') + ' ₽'

// Оплата визита
function PaymentDrawer({ appt, open, onClose }) {
  const [method, setMethod] = useState('Карта')
  const [discount, setDiscount] = useState(0)

  const items = appt ? (appt.service || '').split(' + ').filter(Boolean).map((name) => SERVICE_BASE.find((s) => s.name === name) || { name, price: '0 ₽' }) : []
  const subtotal = items.reduce((s, it) => s + parsePrice(it.price), 0)
  const total = Math.max(0, subtotal - discount)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={appt ? `Оплата визита — ${appt.client}` : 'Оплата визита'}
      footer={<>
        <Button onClick={onClose}>Оплатить {fmtMoney(total)}</Button>
        <Button variant="secondary" onClick={onClose}>Частичная оплата</Button>
        <div style={{ marginLeft: 'auto' }} />
        <Button variant="danger" onClick={onClose}>Возврат</Button>
      </>}
    >
      {appt && (
        <>
          <div className="section-title">Состав визита</div>
          <Card pad={false}>
            <Table
              columns={[{ label: 'Услуга' }, { label: 'Цена', num: true }]}
              rows={items}
              renderRow={(r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td className="num">{r.price}</td>
                </tr>
              )}
            />
          </Card>

          <div className="divider" />
          <Field label="Скидка (₽)">
            <Input type="number" placeholder="0" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
          </Field>
          <div className="kv"><span className="k">Подытог</span><span>{fmtMoney(subtotal)}</span></div>
          <div className="kv"><span className="k">Скидка</span><span>−{fmtMoney(discount)}</span></div>
          <div className="kv" style={{ fontWeight: 700, fontSize: 16 }}><span>Итого к оплате</span><span style={{ color: 'var(--violet)' }}>{fmtMoney(total)}</span></div>

          <div className="divider" />
          <Field label="Способ оплаты">
            <Select options={['Наличные', 'Карта', 'Перевод', 'Онлайн (Mini App)', 'Смешанная', 'Бонусы']} value={method} onChange={(e) => setMethod(e.target.value)} />
          </Field>
          <label className="checkbox"><input type="checkbox" defaultChecked /> <span>Отправить чек клиенту в Telegram</span></label>
        </>
      )}
    </Drawer>
  )
}

// п. 4.4 — карточка записи (создание/редактирование)
function AppointmentDrawer({ open, appt, prefill, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_APPT)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // при каждом открытии заполняем форму (новая запись либо данные существующей)
  useEffect(() => {
    if (!open) return
    if (appt) {
      setForm({
        ...EMPTY_APPT,
        client: appt.client, time: hourToTime(appt.start),
        staffName: STAFF.find((s) => s.id === appt.staff)?.name || STAFF[0].name,
        service: appt.service, duration: labelByDur(appt.dur),
        status: STATUSES[appt.status].label, src: appt.src,
      })
    } else {
      // новая запись: если открыли кликом по ячейке — подставляем сотрудника и время
      setForm({ ...EMPTY_APPT, ...(prefill || {}) })
    }
  }, [open, appt, prefill])

  const save = (pay) => {
    if (!form.client.trim() || !form.service.trim()) return
    onSave({
      staff: STAFF.find((s) => s.name === form.staffName)?.id || STAFF[0].id,
      start: timeToHour(form.time),
      dur: (sumServiceMin(form.service) / 60) || 1,
      client: form.client.trim(),
      service: form.service.trim(),
      status: statusKeyByLabel(form.status),
      src: form.src,
    }, pay)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={appt ? 'Карточка записи' : 'Новая запись'}
      footer={<>
        <Button onClick={() => save(false)}>Сохранить</Button>
        <Button variant="secondary" onClick={() => save(true)}>Сохранить и оплатить</Button>
        <div style={{ marginLeft: 'auto' }} />
        {appt && <Button variant="danger" onClick={onClose}>Удалить</Button>}
      </>}
    >
      <Field label="Клиент"><ClientSearch value={form.client} onChange={(v) => set('client', v)} /></Field>
      <Field label="Дата и время">
        <DateTimePicker date={form.date} time={form.time} onChange={(d, t) => setForm((f) => ({ ...f, date: d, time: t }))} minuteStep={15} />
      </Field>
      <div className="row-fields">
        <Field label="Сотрудник"><Select options={STAFF.map(s => s.name)} value={form.staffName} onChange={(e) => set('staffName', e.target.value)} /></Field>
        <Field label="Ресурс / кабинет"><Select options={['Кресло 1', 'Кресло 2', 'Кабинет косметолога']} value={form.resource} onChange={(e) => set('resource', e.target.value)} /></Field>
      </div>
      <Field label="Услуги"><ServiceSearch value={form.service} onChange={(v) => set('service', v)} /></Field>
      <Field label="Скидка"><Input placeholder="0%" value={form.discount} onChange={(e) => set('discount', e.target.value)} /></Field>
      <div className="row-fields">
        <Field label="Статус визита">
          <Select options={Object.values(STATUSES).map(s => s.label)} value={form.status} onChange={(e) => set('status', e.target.value)} />
        </Field>
        <Field label="Источник записи"><Select options={['Telegram Mini App', 'Телефон', 'Повторная', 'Реклама']} value={form.src} onChange={(e) => set('src', e.target.value)} /></Field>
      </div>
      <Field label="Комментарий"><Input placeholder="Комментарий администратора" value={form.comment} onChange={(e) => set('comment', e.target.value)} /></Field>
      <label className="checkbox"><input type="checkbox" checked={form.notify} onChange={(e) => set('notify', e.target.checked)} /> <span>Уведомить клиента через Telegram-бота</span></label>
    </Drawer>
  )
}
