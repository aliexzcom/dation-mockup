import { useState, useEffect } from 'react'
import { PageHead, Button, Tabs, Drawer, Field, Input, Select, Card, Badge } from '../components/ui.jsx'
import { IcArrowL, IcArrowR, IcPlus, IcFilter } from '../components/icons.jsx'

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

  const handleSave = (appt) => {
    setAppts((prev) => [...prev, appt])
    setDrawer(null)
  }

  return (
    <>
      <PageHead
        crumbs="Журнал записей"
        title="Журнал записей"
        sub="Календарь записей по сотрудникам и ресурсам: создание, перенос и обработка визитов."
        actions={<>
          <Button variant="ghost"><IcFilter size={16} /> Фильтры</Button>
          <Button onClick={() => setDrawer('new')}><IcPlus size={16} /> Новая запись</Button>
        </>}
      />

      {/* Виды: День / Неделя / Месяц / Список (п. 4.2) */}
      <Tabs tabs={['День', 'Неделя', 'Месяц', 'Список записей']} active={view} onChange={setView} />

      {/* Панель управления: навигация по датам, режим, шаг времени (п. 4.3) */}
      <div className="toolbar">
        <Button variant="ghost" size="sm"><IcArrowL size={16} /></Button>
        <Button variant="secondary" size="sm">Сегодня</Button>
        <Button variant="ghost" size="sm"><IcArrowR size={16} /></Button>
        <strong style={{ marginLeft: 6 }}>Вторник, 24 июня 2026</strong>
      </div>

      {view === 'Список записей' ? <ListView appts={appts} onOpen={setDrawer} /> : <DayGrid appts={appts} onOpen={setDrawer} />}

      <AppointmentDrawer open={!!drawer} appt={drawer === 'new' ? null : drawer} onClose={() => setDrawer(null)} onSave={handleSave} />
    </>
  )
}

function DayGrid({ appts, onOpen }) {
  return (
    <Card pad={false}>
      <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(${STAFF.length}, 1fr)`, overflowX: 'auto' }}>
        {/* шапка колонок сотрудников */}
        <div style={{ borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }} />
        {STAFF.map((s) => (
          <div key={s.id} style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', display: 'flex', gap: 9, alignItems: 'center' }}>
            <div className="avatar-sm">{s.ini}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
              <div className="small faint" style={{ whiteSpace: 'nowrap' }}>{s.role}</div>
            </div>
          </div>
        ))}

        {/* сетка времени */}
        {HOURS.map((h) => (
          <div key={h} style={{ display: 'contents' }}>
            <div style={{ padding: '6px 8px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', color: 'var(--text-faint)', fontSize: 12, height: 60 }}>{h}:00</div>
            {STAFF.map((s) => {
              const appt = appts.find((a) => a.staff === s.id && Math.floor(a.start) === h && a.start - h < 1)
              return (
                <div key={s.id} style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', height: 60, position: 'relative', background: h < 9 ? 'var(--bg-soft)' : '#fff' }}>
                  {appt && <ApptCell appt={appt} hour={h} onOpen={onOpen} />}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}

function ApptCell({ appt, hour, onOpen }) {
  const st = STATUSES[appt.status]
  const top = (appt.start - hour) * 60
  const height = appt.dur * 60 - 4
  return (
    <div
      onClick={() => onOpen(appt)}
      title="Перетащите для переноса (drag-and-drop)"
      style={{
        position: 'absolute', left: 3, right: 3, top: top + 1, height,
        background: st.c, borderLeft: `3px solid ${st.b}`, borderRadius: 6,
        padding: '4px 7px', cursor: 'pointer', overflow: 'hidden', fontSize: 12,
      }}>
      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.client}</div>
      <div className="small" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.service}</div>
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

// п. 4.4 — карточка записи (создание/редактирование)
function AppointmentDrawer({ open, appt, onClose, onSave }) {
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
      setForm(EMPTY_APPT)
    }
  }, [open, appt])

  const save = () => {
    if (!form.client.trim() || !form.service.trim()) return
    onSave({
      staff: STAFF.find((s) => s.name === form.staffName)?.id || STAFF[0].id,
      start: timeToHour(form.time),
      dur: DURATIONS.find(([l]) => l === form.duration)?.[1] || 1,
      client: form.client.trim(),
      service: form.service.trim(),
      status: statusKeyByLabel(form.status),
      src: form.src,
    })
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={appt ? 'Карточка записи' : 'Новая запись'}
      footer={<>
        <Button onClick={save}>Сохранить</Button>
        <Button variant="secondary" onClick={save}>Сохранить и оплатить</Button>
        <div style={{ marginLeft: 'auto' }} />
        {appt && <Button variant="danger" onClick={onClose}>Удалить</Button>}
      </>}
    >
      <Field label="Клиент"><Input placeholder="Поиск по базе или + Новый клиент" value={form.client} onChange={(e) => set('client', e.target.value)} /></Field>
      <div className="row-fields">
        <Field label="Дата"><Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
        <Field label="Время начала"><Input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} /></Field>
      </div>
      <div className="row-fields">
        <Field label="Сотрудник"><Select options={STAFF.map(s => s.name)} value={form.staffName} onChange={(e) => set('staffName', e.target.value)} /></Field>
        <Field label="Ресурс / кабинет"><Select options={['Кресло 1', 'Кресло 2', 'Кабинет косметолога']} value={form.resource} onChange={(e) => set('resource', e.target.value)} /></Field>
      </div>
      <Field label="Услуги"><Input placeholder="Добавить услугу…" value={form.service} onChange={(e) => set('service', e.target.value)} /></Field>
      <div className="row-fields">
        <Field label="Длительность"><Select options={DURATIONS.map(([l]) => l)} value={form.duration} onChange={(e) => set('duration', e.target.value)} /></Field>
        <Field label="Скидка"><Input placeholder="0%" value={form.discount} onChange={(e) => set('discount', e.target.value)} /></Field>
      </div>
      <div className="row-fields">
        <Field label="Статус визита">
          <Select options={Object.values(STATUSES).map(s => s.label)} value={form.status} onChange={(e) => set('status', e.target.value)} />
        </Field>
        <Field label="Источник записи"><Select options={['Telegram Mini App', 'Телефон', 'Повторная', 'Реклама']} value={form.src} onChange={(e) => set('src', e.target.value)} /></Field>
      </div>
      <Field label="Комментарий"><Input placeholder="Комментарий администратора" value={form.comment} onChange={(e) => set('comment', e.target.value)} /></Field>
      <label className="checkbox"><input type="checkbox" checked={form.notify} onChange={(e) => set('notify', e.target.checked)} /> <span>Уведомить клиента через Telegram-бота</span></label>

      <div className="divider" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button size="sm" variant="secondary">Перенести</Button>
        <Button size="sm" variant="secondary">Открыть карточку клиента</Button>
        <Button size="sm" variant="secondary">Отметить приход</Button>
        <Button size="sm" variant="ghost">Не пришёл</Button>
      </div>
    </Drawer>
  )
}
