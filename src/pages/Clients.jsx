import { useState } from 'react'
import { PageHead, Button, Card, Tabs, Badge, Table, Field, Input, Textarea, Select, SearchInput, Chips, Empty, Drawer, KV } from '../components/ui.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { formatUzbPhone } from '../components/phone.js'
import { IcPlus, IcExport, IcTrash } from '../components/icons.jsx'

// --- Мок-данные ---
const SEGMENTS = ['Все', 'Активные', 'Новые', 'Потерянные']
const TAGS = ['VIP', 'Аллергия', 'Беременность', 'Постоянный', 'Сложный']
const STAFF_LIST = ['Анна Морозова', 'Игорь Лебедев', 'Светлана Котова', 'Дмитрий Орлов']

const INITIAL_CLIENTS = [
  { id: 1, ini: 'МП', name: 'Мария Петрова', phone: '+7 (900) 123-45-67', telegram: '@masha_p', visits: 14, spent: '42 800 ₽', lastVisit: '18.06.2026', segment: 'Активные', status: 'active', tags: ['VIP'] },
  { id: 2, ini: 'ОК', name: 'Ольга Кузнецова', phone: '+7 (910) 234-56-78', telegram: '@olga_kuz', visits: 3, spent: '8 500 ₽', lastVisit: '20.06.2026', segment: 'Новые', status: 'new', tags: [] },
  { id: 3, ini: 'ЕС', name: 'Елена Смирнова', phone: '+7 (920) 345-67-89', telegram: '—', visits: 7, spent: '21 300 ₽', lastVisit: '02.02.2026', segment: 'Потерянные', status: 'lost', tags: ['Аллергия'] },
  { id: 4, ini: 'АБ', name: 'Артём Белов', phone: '+7 (930) 456-78-90', telegram: '@artem_b', visits: 22, spent: '68 400 ₽', lastVisit: '22.06.2026', segment: 'Активные', status: 'active', tags: ['VIP', 'Постоянный'] },
  { id: 5, ini: 'ДЛ', name: 'Дарья Лебедева', phone: '+7 (940) 567-89-01', telegram: '@dasha_leb', visits: 1, spent: '2 200 ₽', lastVisit: '23.06.2026', segment: 'Новые', status: 'new', tags: [] },
  { id: 6, ini: 'СН', name: 'Светлана Новикова', phone: '+7 (950) 678-90-12', telegram: '@sveta_n', visits: 9, spent: '31 000 ₽', lastVisit: '10.03.2026', segment: 'Потерянные', status: 'lost', tags: [] },
  { id: 7, ini: 'ИР', name: 'Инна Рыжова', phone: '+7 (960) 789-01-23', telegram: '@inna_r', visits: 18, spent: '55 600 ₽', lastVisit: '19.06.2026', segment: 'Активные', status: 'active', tags: ['Постоянный'] },
  { id: 8, ini: 'ПМ', name: 'Павел Морозов', phone: '+7 (970) 890-12-34', telegram: '@pavel_m', visits: 5, spent: '14 700 ₽', lastVisit: '15.06.2026', segment: 'Активные', status: 'active', tags: [] },
]

const VISITS_HISTORY = [
  { date: '18.06.2026', services: 'Стрижка + укладка', staff: 'Анна Морозова', amount: '2 800 ₽', status: 'done' },
  { date: '05.06.2026', services: 'Окрашивание', staff: 'Анна Морозова', amount: '6 500 ₽', status: 'done' },
  { date: '20.05.2026', services: 'Стрижка', staff: 'Игорь Лебедев', amount: '1 500 ₽', status: 'noshow' },
  { date: '10.05.2026', services: 'Маникюр + покрытие', staff: 'Светлана Котова', amount: '2 200 ₽', status: 'done' },
]

const FUTURE_VISITS = [
  { date: '28.06.2026', services: 'Окрашивание', staff: 'Анна Морозова', amount: '6 500 ₽', status: 'conf' },
]

const PAYMENTS = [
  { date: '18.06.2026', type: 'Оплата', method: 'Карта', amount: '2 800 ₽' },
  { date: '05.06.2026', type: 'Оплата', method: 'Наличные', amount: '6 500 ₽' },
  { date: '10.05.2026', type: 'Оплата', method: 'Карта', amount: '2 200 ₽' },
]

const MESSAGES = [
  { date: '18.06.2026 11:00', text: 'Напоминание о записи на 18.06 в 11:00 к Анне Морозовой.', status: 'Доставлено' },
  { date: '05.06.2026 09:30', text: 'Напоминание о записи на 05.06 в 10:00 к Анне Морозовой.', status: 'Прочитано' },
  { date: '01.06.2026 12:00', text: 'Акционное предложение: скидка 10% на окрашивание в июне.', status: 'Доставлено' },
]

const AUTO_SEGMENTS = [
  { name: 'RFM: Чемпионы', count: 34, color: 'green' },
  { name: 'RFM: Под угрозой', count: 18, color: 'amber' },
  { name: 'Давно не были (90+ дней)', count: 41, color: 'red' },
  { name: 'Новые (до 30 дней)', count: 12, color: 'blue' },
  { name: 'Именинники (этот месяц)', count: 7, color: '' },
]

const EMPTY_CLIENT = {
  name: '',
  lastName: '',
  phone: '',
  birthday: '',
  gender: 'Не указан',
  source: 'Выберите источник',
  tag: 'Без тега',
  staff: 'Не назначен',
  comment: '',
}

function statusBadge(s) {
  if (s === 'active') return <Badge color="green">Активный</Badge>
  if (s === 'new') return <Badge color="blue">Новый</Badge>
  return <Badge color="gray">Потерянный</Badge>
}

function visitStatusBadge(s) {
  if (s === 'done') return <Badge color="green">Оказана</Badge>
  if (s === 'conf') return <Badge color="blue">Подтверждён</Badge>
  if (s === 'noshow') return <Badge color="red">Не пришёл</Badge>
  return <Badge color="gray">{s}</Badge>
}

// Компактная строка визита (вместо таблицы — чтобы свободно помещалось в узком drawer)
function VisitRow({ r }) {
  return (
    <div className="feed-row">
      <div className="feed-head">
        <span style={{ fontWeight: 600 }}>{r.date}</span>
        <span style={{ marginLeft: 'auto' }}>{visitStatusBadge(r.status)}</span>
      </div>
      <div>{r.services}</div>
      <div className="small muted">{r.staff} · {r.amount}</div>
    </div>
  )
}

// --- Drawer карточки клиента ---
function ClientDrawer({ client, open, onClose }) {
  const [tab, setTab] = useState('Обзор')

  if (!client) return null

  const TABS = ['Обзор', 'Визиты', 'Финансы', 'Уведомления']

  return (
    <Drawer
      title={client.name}
      open={open}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm"><IcPlus size={14} /> Создать запись</Button>
          <Button variant="secondary" size="sm">Сообщение через бота</Button>
          <div style={{ flex: 1 }} />
          <Button variant="danger" size="sm"><IcTrash size={14} /> Удалить</Button>
        </div>
      }
    >
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Обзор' && (
        <div style={{ marginTop: 16 }}>
          <KV items={[
            ['Телефон', client.phone],
            ['Телефон 2', '—'],
            ['Telegram', client.telegram],
            ['E-mail', '—'],
            ['День рождения', '15.03.1990'],
            ['Пол', 'Женский'],
            ['Адрес', '—'],
            ['Источник', 'Instagram'],
            ['Ответственный', 'Анна Морозова'],
            ['Сегмент', client.segment],
            ['Задолженность', '0 ₽'],
            ['Согласие на уведомления', 'Да'],
          ]} />
          <div style={{ marginTop: 12 }}>
            <div className="section-title">Теги</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {client.tags.length > 0
                ? client.tags.map((t) => <span className="tag" key={t}>{t}</span>)
                : <span className="muted small">Теги не добавлены</span>}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="section-title">Комментарий</div>
            <div className="note" style={{ marginTop: 4 }}>Предпочитает запись по вечерам. Аллергия на аммиак — уточнить перед окрашиванием.</div>
          </div>
        </div>
      )}

      {tab === 'Визиты' && (
        <div style={{ marginTop: 16 }}>
          <div className="section-title" style={{ marginBottom: 8 }}>Будущие записи</div>
          {FUTURE_VISITS.length > 0
            ? FUTURE_VISITS.map((r, i) => <VisitRow key={i} r={r} />)
            : <div className="muted small" style={{ marginBottom: 12 }}>Нет предстоящих записей</div>}
          <div style={{ marginTop: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="section-title" style={{ margin: 0 }}>История визитов</div>
            <div style={{ flex: 1 }} />
            <Button size="sm"><IcPlus size={14} /> Записать</Button>
          </div>
          {VISITS_HISTORY.map((r, i) => <VisitRow key={i} r={r} />)}
        </div>
      )}

      {tab === 'Финансы' && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div className="stat"><div className="label">Всего потрачено</div><div className="value">{client.spent}</div></div>
            <div className="stat"><div className="label">Задолженность</div><div className="value">0 ₽</div></div>
            <div className="stat"><div className="label">Возвраты</div><div className="value">0 ₽</div></div>
          </div>
          <div className="section-title" style={{ marginBottom: 8 }}>История платежей</div>
          <Table
            columns={[{ label: 'Дата' }, { label: 'Тип' }, { label: 'Способ' }, { label: 'Сумма', num: true }]}
            rows={PAYMENTS}
            renderRow={(r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.type}</td>
                <td>{r.method}</td>
                <td className="num">{r.amount}</td>
              </tr>
            )}
          />
          <div className="section-title" style={{ marginBottom: 8, marginTop: 16 }}>Возвраты</div>
          <div className="muted small">Возвратов не зафиксировано.</div>
        </div>
      )}

      {tab === 'Уведомления' && (
        <div style={{ marginTop: 16 }}>
          <div className="section-title" style={{ marginBottom: 8 }}>История сообщений через Telegram-бота</div>
          {MESSAGES.map((m, i) => (
            <div key={i} className="feed-row">
              <div className="feed-head">
                <span className="small muted">{m.date}</span>
                <Badge color={m.status === 'Прочитано' ? 'green' : 'gray'}>{m.status}</Badge>
              </div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>
      )}

    </Drawer>
  )
}

// --- Drawer «Новый клиент» ---
function NewClientDrawer({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_CLIENT)

  function handleSave() {
    if (!form.name.trim()) return
    onSave(form)
    setForm(EMPTY_CLIENT)
  }

  function handleClose() {
    setForm(EMPTY_CLIENT)
    onClose()
  }

  return (
    <Drawer
      title="Новый клиент"
      open={open}
      onClose={handleClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="grid grid-2">
          <Field label="Имя">
            <Input
              placeholder="Имя"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Фамилия">
            <Input
              placeholder="Фамилия"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Телефон (основной)">
          <Input
            type="tel"
            placeholder="+998 90 123 45 67"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatUzbPhone(e.target.value) })}
          />
        </Field>
        <div className="grid grid-2">
          <Field label="Дата рождения">
            <DatePicker value={form.birthday} onChange={(v) => setForm({ ...form, birthday: v })} />
          </Field>
          <Field label="Пол">
            <Select
              options={['Не указан', 'Женский', 'Мужской']}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Источник привлечения">
          <Select
            options={['Выберите источник', 'Instagram', 'ВКонтакте', 'Рекомендация', 'Reels/TikTok', 'Сайт', 'Другое']}
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
        </Field>
        <Field label="Теги">
          <Select
            options={['Без тега', 'VIP', 'Аллергия', 'Беременность', 'Постоянный', 'Сложный']}
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
          />
        </Field>
        <Field label="Ответственный сотрудник">
          <Select
            options={['Не назначен', ...STAFF_LIST]}
            value={form.staff}
            onChange={(e) => setForm({ ...form, staff: e.target.value })}
          />
        </Field>
        <Field label="Комментарий">
          <Textarea
            placeholder="Примечания о клиенте..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
        </Field>
      </div>
    </Drawer>
  )
}

// --- Главная страница ---
export default function Clients() {
  const [rows, setRows] = useState(INITIAL_CLIENTS)
  const [tab, setTab] = useState('Список клиентов')
  const [seg, setSeg] = useState('Все')
  const [selectedClient, setSelectedClient] = useState(null)
  const [newOpen, setNewOpen] = useState(false)

  function handleSaveClient(form) {
    const fullName = [form.name.trim(), form.lastName.trim()].filter(Boolean).join(' ')
    const initials = fullName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('')
    const newClient = {
      id: Date.now(),
      ini: initials || '?',
      name: fullName,
      phone: form.phone || '—',
      telegram: '—',
      visits: 0,
      spent: '0 ₽',
      lastVisit: '—',
      segment: 'Новые',
      status: 'new',
      tags: form.tag && form.tag !== 'Без тега' ? [form.tag] : [],
    }
    setRows([newClient, ...rows])
    setNewOpen(false)
  }

  const visibleClients = seg === 'Все'
    ? rows
    : rows.filter((c) => {
        if (seg === 'Активные') return c.status === 'active'
        if (seg === 'Новые') return c.status === 'new'
        if (seg === 'Потерянные') return c.status === 'lost'
        return true
      })

  return (
    <>
      <PageHead
        crumbs="Клиенты"
        title="Клиенты"
        sub="Управление клиентской базой, CRM и сегментация."
        actions={
          <>
            <Button variant="ghost" size="sm"><IcExport size={16} /> Экспорт</Button>
            <Button variant="secondary" size="sm">Импорт Excel/CSV</Button>
            <Button size="sm" onClick={() => setNewOpen(true)}><IcPlus size={16} /> Новый клиент</Button>
          </>
        }
      />

      <Tabs
        tabs={['Список клиентов', 'Сегменты']}
        active={tab}
        onChange={setTab}
      />

      {tab === 'Список клиентов' && (
        <>
          <div className="toolbar">
            <SearchInput placeholder="Поиск по имени, телефону, Telegram..." />
            <div className="spacer" />
            <Chips items={SEGMENTS} active={seg} onChange={setSeg} />
          </div>
          <div className="toolbar" style={{ marginTop: 8 }}>
            <Select options={['Любой сотрудник', ...STAFF_LIST]} style={{ width: 175 }} />
            <Select options={['Любые теги', ...TAGS]} style={{ width: 150 }} />
            <Select options={['Все клиенты', 'Есть задолженность', 'Без задолженности']} style={{ width: 185 }} />
            <Select options={['Любая дата визита', 'Сегодня', 'На этой неделе', 'В этом месяце']} style={{ width: 180 }} />
          </div>
          <Card pad={false} style={{ marginTop: 12 }}>
            <Table
              columns={[
                { label: '' },
                { label: 'Имя' },
                { label: 'Телефон' },
                { label: 'Telegram' },
                { label: 'Визитов', num: true },
                { label: 'Потрачено', num: true },
                { label: 'Последний визит' },
                { label: 'Сегмент' },
                { label: 'Статус' },
              ]}
              rows={visibleClients}
              renderRow={(r, i) => (
                <tr
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedClient(r)}
                >
                  <td>
                    <div className="avatar-sm">{r.ini}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    {r.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                        {r.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                      </div>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.phone}</td>
                  <td>{r.telegram}</td>
                  <td className="num">{r.visits}</td>
                  <td className="num">{r.spent}</td>
                  <td>{r.lastVisit}</td>
                  <td>{r.segment}</td>
                  <td>{statusBadge(r.status)}</td>
                </tr>
              )}
            />
          </Card>
        </>
      )}

      {tab === 'Сегменты' && (
        <div style={{ marginTop: 16 }}>
          <div className="grid grid-2" style={{ marginBottom: 24 }}>
            <Card title="Авто-сегменты (RFM и поведенческие)">
              {AUTO_SEGMENTS.map((s, i) => (
                <div key={i} className="list-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{s.name}</span>
                  <Badge color={s.color}>{s.count} клиентов</Badge>
                </div>
              ))}
            </Card>
            <Card
              title="Ручные сегменты"
              actions={<Button size="sm"><IcPlus size={14} /> Создать</Button>}
            >
              <Empty
                title="Нет ручных сегментов"
                text="Создайте сегмент вручную, задав условия фильтрации."
                action={<Button size="sm"><IcPlus size={14} /> Создать сегмент</Button>}
              />
            </Card>
          </div>
        </div>
      )}

      <ClientDrawer
        client={selectedClient}
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />

      <NewClientDrawer
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onSave={handleSaveClient}
      />
    </>
  )
}
