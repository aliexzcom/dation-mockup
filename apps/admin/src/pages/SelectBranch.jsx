import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHead, Button, Badge, Field, Input, Select, Drawer } from '../components/ui.jsx'
import { TimePicker } from '../components/TimePicker.jsx'
import { IcPlus, IcGear } from '../components/icons.jsx'

const INITIAL_BRANCHES = [
  { id: 1, name: 'Центральный', address: 'г. Москва, ул. Арбат, 5', manager: 'Алина Смирнова', status: 'active', staff: 8, bookings: 382 },
  { id: 2, name: 'Северный', address: 'г. Москва, Дмитровское ш., 34', manager: 'Виктор Соколов', status: 'active', staff: 5, bookings: 241 },
  { id: 3, name: 'Выхино', address: 'г. Москва, ул. Ташкентская, 9', manager: 'Нет', status: 'closed', staff: 0, bookings: 0 },
]

const EMPTY_BRANCH = { name: '', address: '', phone: '', timeStart: '09:00', timeEnd: '21:00', days: 'Пн–Пт', manager: 'Алина Смирнова' }

// Раздел «Филиалы» уровня бизнеса: карточки филиалов, клик — вход в филиал
export default function SelectBranch() {
  const navigate = useNavigate()
  const [branches, setBranches] = useState(INITIAL_BRANCHES)
  const [drawer, setDrawer] = useState(null) // null | 'new' | branch
  const [form, setForm] = useState(EMPTY_BRANCH)

  const enter = (b) => {
    if (b.status === 'closed') return
    navigate('/journal')
  }

  const openEdit = (e, b) => { e.stopPropagation(); setDrawer(b) }

  const saveBranch = () => {
    if (!form.name.trim()) return
    setBranches([{ id: Date.now(), name: form.name.trim(), address: form.address, manager: form.manager, status: 'active', staff: 0, bookings: 0 }, ...branches])
    setForm(EMPTY_BRANCH)
    setDrawer(null)
  }

  return (
    <>
      <PageHead
        crumbs="Филиалы"
        title="Филиалы"
        sub="Выберите филиал, чтобы войти в его рабочее пространство, или управляйте сетью."
        actions={<Button onClick={() => { setForm(EMPTY_BRANCH); setDrawer('new') }}><IcPlus size={16} /> Филиал</Button>}
      />

      <div className="grid grid-3">
        {branches.map((b) => (
          <div key={b.id} className={`branch-card ${b.status === 'closed' ? 'disabled' : ''}`} onClick={() => enter(b)}>
            <button className="icon-btn" style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30 }} onClick={(e) => openEdit(e, b)} title="Настройки филиала">
              <IcGear size={15} />
            </button>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, paddingRight: 34 }}>{b.name}</div>
            <Badge color={b.status === 'active' ? 'green' : 'gray'}>{b.status === 'active' ? 'Активен' : 'Закрыт'}</Badge>
            <div className="small muted" style={{ marginTop: 12 }}>{b.address}</div>
            <div className="small muted" style={{ marginTop: 4 }}>Ответственный: {b.manager}</div>
            <div className="divider" style={{ margin: '14px 0' }} />
            <div style={{ display: 'flex', gap: 18 }}>
              <div><div style={{ fontWeight: 700 }}>{b.staff}</div><div className="small faint">сотрудников</div></div>
              <div><div style={{ fontWeight: 700 }}>{b.bookings}</div><div className="small faint">записей / мес</div></div>
            </div>
          </div>
        ))}

        <div className="branch-card add" onClick={() => { setForm(EMPTY_BRANCH); setDrawer('new') }}>
          <IcPlus size={26} />
          <span>Добавить филиал</span>
        </div>
      </div>

      {/* Drawer: создать / настроить филиал */}
      <Drawer
        title={drawer && drawer !== 'new' ? `Настройки: ${drawer.name}` : 'Новый филиал'}
        open={!!drawer}
        onClose={() => { setDrawer(null); setForm(EMPTY_BRANCH) }}
        footer={
          <>
            <Button onClick={drawer === 'new' ? saveBranch : () => setDrawer(null)}>Сохранить</Button>
            <Button variant="secondary" onClick={() => { setDrawer(null); setForm(EMPTY_BRANCH) }}>Отмена</Button>
            {drawer && drawer !== 'new' && <Button variant="danger" style={{ marginLeft: 'auto' }}>Удалить</Button>}
          </>
        }
      >
        {drawer === 'new' ? (
          <>
            <Field label="Название филиала"><Input placeholder="Например: Центральный" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Адрес"><Input placeholder="Город, улица, дом" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Телефон"><Input placeholder="+998 90 123 45 67" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <div className="grid grid-2">
              <Field label="Начало дня"><TimePicker value={form.timeStart} onChange={(v) => setForm({ ...form, timeStart: v })} /></Field>
              <Field label="Конец дня"><TimePicker value={form.timeEnd} onChange={(v) => setForm({ ...form, timeEnd: v })} /></Field>
            </div>
            <Field label="Рабочие дни"><Select options={['Пн–Пт', 'Пн–Сб', 'Пн–Вс', 'Вт–Вс']} value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} /></Field>
            <Field label="Ответственный"><Select options={['Алина Смирнова', 'Виктор Соколов', 'Игорь Лебедев', '— Не назначен —']} value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} /></Field>
          </>
        ) : drawer ? (
          <>
            <Field label="Название филиала"><Input defaultValue={drawer.name} /></Field>
            <Field label="Адрес"><Input defaultValue={drawer.address} /></Field>
            <Field label="Ответственный"><Select options={['Алина Смирнова', 'Виктор Соколов', 'Игорь Лебедев', '— Не назначен —']} defaultValue={drawer.manager} /></Field>
            <Field label="Статус филиала"><Select options={['Активен', 'Закрыт', 'В разработке']} defaultValue={drawer.status === 'active' ? 'Активен' : 'Закрыт'} /></Field>
          </>
        ) : null}
      </Drawer>
    </>
  )
}
