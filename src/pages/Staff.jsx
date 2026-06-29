import { useState } from 'react'
import { PageHead, Button, Card, Stat, Tabs, Badge, Table, Field, Input, Textarea, Select, Switch, SearchInput, Chips, Drawer, KV } from '../components/ui.jsx'
import { formatUzbPhone } from '../components/phone.js'
import { ServicePicker } from '../components/ServicePicker.jsx'

// Категории услуг для специализаций сотрудника
const SPEC_CATEGORIES = ['Стрижки', 'Окрашивание', 'Уходы для волос', 'Маникюр', 'Педикюр', 'Чистки', 'Пилинги', 'Барбершоп', 'Брови и ресницы', 'Массаж', 'Косметология']

// Разделы системы для настройки доступа сотрудника
const ACCESS_SECTIONS = [
  'Журнал записей', 'Telegram Mini App', 'Клиенты (CRM)', 'Услуги', 'Сотрудники',
  'Финансы', 'Склад', 'Уведомления', 'Настройки', 'Тарифы и оплата',
  'Аналитика и отчёты', 'Отчёты по товарам',
]
const ACCESS_LEVELS = ['Закрыто', 'Просмотр', 'Редактирование']
import { IcPlus, IcExport, IcEdit, IcTrash } from '../components/icons.jsx'

// ─── Мок-данные ───────────────────────────────────────────────────────────────

const STAFF_LIST = [
  {
    id: 1, ini: 'АМ', name: 'Анна Морозова', role: 'Парикмахер-стилист',
    specs: ['Стрижки', 'Окрашивание', 'Укладки'], status: 'active',
    rating: 4.9, branch: 'Центральный', phone: '+7 (916) 100-01-01', email: 'a.morozova@salon.ru',
    revenue: '186 400 ₽', visits: 98, avgCheck: '1 902 ₽', load: '82%', repeat: '74%',
  },
  {
    id: 2, ini: 'ИЛ', name: 'Игорь Лебедев', role: 'Барбер',
    specs: ['Мужские стрижки', 'Бритьё', 'Борода'], status: 'active',
    rating: 4.8, branch: 'Центральный', phone: '+7 (916) 200-02-02', email: 'i.lebedev@salon.ru',
    revenue: '141 200 ₽', visits: 114, avgCheck: '1 239 ₽', load: '91%', repeat: '68%',
  },
  {
    id: 3, ini: 'СК', name: 'Светлана Котова', role: 'Мастер маникюра',
    specs: ['Маникюр', 'Педикюр', 'Наращивание'], status: 'active',
    rating: 4.7, branch: 'Северный', phone: '+7 (916) 300-03-03', email: 's.kotova@salon.ru',
    revenue: '97 800 ₽', visits: 76, avgCheck: '1 287 ₽', load: '78%', repeat: '81%',
  },
  {
    id: 4, ini: 'ДО', name: 'Дмитрий Орлов', role: 'Косметолог',
    specs: ['Чистка лица', 'Пилинг', 'Мезотерапия'], status: 'active',
    rating: 4.6, branch: 'Северный', phone: '+7 (916) 400-04-04', email: 'd.orlov@salon.ru',
    revenue: '124 600 ₽', visits: 59, avgCheck: '2 112 ₽', load: '69%', repeat: '77%',
  },
  {
    id: 5, ini: 'НВ', name: 'Наталья Власова', role: 'Парикмахер',
    specs: ['Стрижки', 'Укладки'], status: 'fired',
    rating: 4.2, branch: 'Центральный', phone: '+7 (916) 500-05-05', email: 'n.vlasova@salon.ru',
    revenue: '—', visits: 0, avgCheck: '—', load: '—', repeat: '—',
  },
]

const SERVICES_BY_STAFF = [
  { name: 'Стрижка женская', duration: '60 мин', price: '1 800 ₽', base: '1 800 ₽' },
  { name: 'Стрижка + укладка', duration: '90 мин', price: '2 400 ₽', base: '2 200 ₽' },
  { name: 'Окрашивание (корни)', duration: '120 мин', price: '3 500 ₽', base: '3 200 ₽' },
  { name: 'Сложное окрашивание', duration: '180 мин', price: '5 800 ₽', base: '5 500 ₽' },
  { name: 'Укладка', duration: '45 мин', price: '900 ₽', base: '900 ₽' },
]

const SALARY_HISTORY = [
  { period: 'Май 2026', services: '55 920 ₽', goods: '0 ₽', base: '25 000 ₽', bonus: '3 000 ₽', fine: '0 ₽', advance: '10 000 ₽', total: '73 920 ₽', paid: '63 920 ₽', status: 'paid' },
  { period: 'Апрель 2026', services: '48 640 ₽', goods: '0 ₽', base: '25 000 ₽', bonus: '0 ₽', fine: '500 ₽', advance: '0 ₽', total: '73 140 ₽', paid: '73 140 ₽', status: 'paid' },
  { period: 'Март 2026', services: '52 300 ₽', goods: '0 ₽', base: '25 000 ₽', bonus: '2 000 ₽', fine: '0 ₽', advance: '15 000 ₽', total: '79 300 ₽', paid: '64 300 ₽', status: 'paid' },
]

const PAYSLIP_ROWS = [
  ['Оклад (ставка)', '25 000 ₽'],
  ['% от услуг (30%)', '55 920 ₽'],
  ['% от товаров (5%)', '0 ₽'],
  ['Бонус (план выполнен)', '3 000 ₽'],
  ['Аванс', '−10 000 ₽'],
  ['Штрафы', '0 ₽'],
  ['Итого к выплате', '73 920 ₽'],
]

const WEEK_DAYS = ['Пн 23.06', 'Вт 24.06', 'Ср 25.06', 'Чт 26.06', 'Пт 27.06', 'Сб 28.06', 'Вс 29.06']

// ─── Пустая форма нового сотрудника ───────────────────────────────────────────

const EMPTY_STAFF = { name: '', role: '', phone: '', password: '', branch: 'Центральный', specs: [], status: 'active' }

// ─── Основной компонент ────────────────────────────────────────────────────────

export default function Staff() {
  const [search] = useState('')
  const [statusFilter, setStatusFilter] = useState('Все')
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rows, setRows] = useState(STAFF_LIST)

  const filtered = rows.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Все' || (statusFilter === 'Работает' && s.status === 'active') ||
      (statusFilter === 'Уволен' && s.status === 'fired')
    return matchSearch && matchStatus
  })

  function openDrawer(staff) {
    setSelected(staff)
    setDrawerOpen(true)
  }

  function addStaff(formData) {
    const specsArr = formData.specs || []
    const ini = formData.name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    const newRow = {
      id: Date.now(),
      ini,
      name: formData.name.trim(),
      role: formData.role.trim() || '—',
      specs: specsArr,
      status: 'active',
      rating: '—',
      branch: formData.branch || 'Центральный',
      phone: formData.phone || '—',
      revenue: '—', visits: 0, avgCheck: '—', load: '—', repeat: '—',
    }
    setRows([newRow, ...rows])
  }

  return (
    <>
      <PageHead
        crumbs="Сотрудники"
        title="Сотрудники"
        sub="Управление персоналом, графиками работы, зарплатными схемами и доступами."
        actions={<>
          <Button variant="ghost"><IcExport size={16} /> Экспорт</Button>
          <Button onClick={() => openDrawer(null)}><IcPlus size={16} /> Сотрудник</Button>
        </>}
      />

      <div className="toolbar">
        <SearchInput placeholder="Поиск по имени или должности" />
        <div className="spacer" />
        <Chips
          items={['Все', 'Работает', 'Уволен']}
          active={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Сотрудник' },
            { label: 'Должность' },
            { label: 'Специализации' },
            { label: 'Филиал' },
            { label: 'Рейтинг', num: true },
            { label: 'Статус' },
            { label: '' },
          ]}
          rows={filtered}
          renderRow={(s, i) => (
            <tr key={i} style={{ cursor: 'pointer' }} onClick={() => openDrawer(s)}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar-sm">{s.ini}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="small muted">{s.phone}</div>
                  </div>
                </div>
              </td>
              <td>{s.role}</td>
              <td>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {s.specs.map((sp, j) => <span key={j} className="tag">{sp}</span>)}
                </div>
              </td>
              <td>{s.branch}</td>
              <td className="num">{s.rating}</td>
              <td>
                <Badge color={s.status === 'active' ? 'green' : 'gray'}>
                  {s.status === 'active' ? 'Работает' : 'Уволен'}
                </Badge>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openDrawer(s) }}>
                    <IcEdit size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <IcTrash size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      <StaffDrawer
        open={drawerOpen}
        staff={selected}
        onClose={() => setDrawerOpen(false)}
        onAdd={addStaff}
      />
    </>
  )
}

// ─── Drawer карточки сотрудника ───────────────────────────────────────────────

function StaffDrawer({ open, staff, onClose, onAdd }) {
  const [innerTab, setInnerTab] = useState('Профиль')
  const [miniApp, setMiniApp] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [form, setForm] = useState(EMPTY_STAFF)
  const [access, setAccess] = useState(() => Object.fromEntries(ACCESS_SECTIONS.map((s) => [s, 'Просмотр'])))

  const isNew = !staff

  function handleSave() {
    if (!form.name?.trim()) return
    onAdd(form)
    setForm(EMPTY_STAFF)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isNew ? 'Новый сотрудник' : staff?.name}
      footer={<>
        <Button onClick={isNew ? handleSave : undefined}>{isNew ? 'Создать' : 'Сохранить'}</Button>
        <Button variant="secondary" onClick={onClose}>Отмена</Button>
        <div className="spacer" />
        {!isNew && <Button variant="danger">Уволить</Button>}
      </>}
    >
      <Tabs
        tabs={isNew ? ['Профиль', 'Доступы'] : ['Профиль', 'Доступы', 'График', 'Услуги и цены', 'Зарплата', 'Статистика', 'Расчётный лист']}
        active={innerTab}
        onChange={setInnerTab}
      />

      {innerTab === 'Доступы' && (
        <div>
          <div className="section-title">Доступы к разделам</div>
          <div className="note small" style={{ marginBottom: 10 }}>Для каждого раздела выберите уровень доступа сотрудника.</div>
          {ACCESS_SECTIONS.map((sec) => (
            <div key={sec} className="list-line" style={{ justifyContent: 'space-between', gap: 10 }}>
              <span style={{ flex: 1 }}>{sec}</span>
              <div className="segmented" style={{ flexShrink: 0 }}>
                {ACCESS_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`seg-btn ${access[sec] === lvl ? 'active' : ''}`}
                    style={{ padding: '5px 10px', fontSize: 12 }}
                    onClick={() => setAccess((a) => ({ ...a, [sec]: lvl }))}
                  >
                    {lvl === 'Редактирование' ? 'Редакт.' : lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {innerTab === 'Профиль' && (
        <div>
          <div className="section-title">Основная информация</div>
          <div className="grid grid-2">
            <Field label="Имя">
              {isNew
                ? <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Имя сотрудника" />
                : <Input defaultValue={staff?.name || ''} placeholder="Имя сотрудника" />
              }
            </Field>
            <Field label="Должность">
              {isNew
                ? <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Парикмахер-стилист" />
                : <Input defaultValue={staff?.role || ''} placeholder="Парикмахер-стилист" />
              }
            </Field>
          </div>
          <div className="grid grid-2">
            <Field label="Телефон (логин для входа)">
              {isNew
                ? <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatUzbPhone(e.target.value) })} placeholder="+998 90 123 45 67" />
                : <Input type="tel" defaultValue={staff?.phone || ''} placeholder="+998 90 123 45 67" />
              }
            </Field>
            <Field label="Пароль для входа">
              {isNew
                ? <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Минимум 6 символов" />
                : <Input type="password" placeholder="Оставьте пустым, чтобы не менять" />
              }
            </Field>
          </div>
          <Field label="Филиал">
            {isNew
              ? <Select options={['Центральный', 'Северный', 'Южный']} value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
              : <Select options={['Центральный', 'Северный', 'Южный']} />
            }
          </Field>

          <div className="divider" />
          <div className="section-title">Специализации и доступ</div>
          <Field label="Специализации (категории услуг)">
            <ServicePicker
              options={SPEC_CATEGORIES.map((c) => ({ name: c }))}
              value={isNew ? form.specs : (staff?.specs || [])}
              onChange={(arr) => { if (isNew) setForm({ ...form, specs: arr }) }}
              placeholder="Поиск категории"
            />
          </Field>
          <div className="divider" />
          <div className="section-title">Mini App и описание</div>
          <div className="list-line" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 500 }}>Отображать в Mini App</div>
              <div className="small muted">Клиенты смогут записываться к этому мастеру онлайн</div>
            </div>
            <Switch on={miniApp} onClick={() => setMiniApp(!miniApp)} />
          </div>
          <div className="list-line" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 500 }}>Уведомления о записях</div>
              <div className="small muted">Telegram-уведомления при новой записи</div>
            </div>
            <Switch on={notifications} onClick={() => setNotifications(!notifications)} />
          </div>
          <Field label="Описание для клиентов">
            <Textarea placeholder="Короткое описание мастера, опыт, специализация…" defaultValue="" />
          </Field>
          <Field label="Фото (URL)">
            <Input placeholder="https://..." />
          </Field>
        </div>
      )}

      {innerTab === 'График' && (
        <div>
          <div className="section-title">Шаблон смен</div>
          <Field label="Рабочий шаблон">
            <Select options={['2/2 (10 ч)', '5/2 (8 ч)', '6/1', 'Индивидуальный']} />
          </Field>
          <Field label="Рабочие часы по умолчанию">
            <div className="grid grid-2">
              <Input placeholder="09:00" />
              <Input placeholder="20:00" />
            </div>
          </Field>

          <div className="divider" />
          <div className="section-title">Текущая неделя (23–29 июня)</div>
          {WEEK_DAYS.map((day, i) => (
            <div key={i} className="list-line" style={{ justifyContent: 'space-between' }}>
              <span style={{ minWidth: 90, fontWeight: 500 }}>{day}</span>
              <Select options={['Рабочий день', 'Выходной', 'Отпуск', 'Больничный']} style={{ width: 160 }} />
              <Input placeholder="09:00" style={{ width: 70 }} />
              <span className="muted">–</span>
              <Input placeholder="20:00" style={{ width: 70 }} />
            </div>
          ))}

          <div className="divider" />
          <div className="section-title">Перерывы</div>
          {[['Обед', '13:00 – 14:00'], ['Перерыв', '17:00 – 17:15']].map(([t, d], i) => (
            <div key={i} className="list-line" style={{ justifyContent: 'space-between' }}>
              <span>{t}</span>
              <Badge color="gray">{d}</Badge>
              <Button size="sm" variant="ghost"><IcTrash size={13} /></Button>
            </div>
          ))}
          <Button size="sm" variant="secondary" style={{ marginTop: 8 }}><IcPlus size={14} /> Добавить перерыв</Button>
        </div>
      )}

      {innerTab === 'Услуги и цены' && (
        <div>
          <div className="section-title">Индивидуальные цены и длительность</div>
          <p className="small muted" style={{ marginBottom: 12 }}>
            Здесь можно задать персональную цену или длительность для каждой услуги.
            Если не задано — применяется базовая цена.
          </p>
          <Card pad={false}>
            <Table
              columns={[
                { label: 'Услуга' },
                { label: 'Длительность' },
                { label: 'Базовая цена', num: true },
                { label: 'Индив. цена', num: true },
              ]}
              rows={SERVICES_BY_STAFF}
              renderRow={(r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.duration}</td>
                  <td className="num muted">{r.base}</td>
                  <td className="num"><Input defaultValue={r.price} style={{ width: 90, textAlign: 'right' }} /></td>
                </tr>
              )}
            />
          </Card>
          <Button size="sm" variant="secondary" style={{ marginTop: 12 }}><IcPlus size={14} /> Добавить услугу</Button>
        </div>
      )}

      {innerTab === 'Зарплата' && (
        <div>
          <div className="section-title">Схема расчёта</div>
          <div className="grid grid-2">
            <Field label="Оклад / ставка">
              <Input defaultValue="25 000 ₽" />
            </Field>
            <Field label="Тип оклада">
              <Select options={['Фиксированный оклад', 'Ставка за смену', 'Только проценты']} />
            </Field>
          </div>
          <div className="grid grid-2">
            <Field label="% от услуг">
              <Input defaultValue="30%" />
            </Field>
            <Field label="% от товаров">
              <Input defaultValue="5%" />
            </Field>
          </div>
          <Field label="Бонусы / условия">
            <Textarea placeholder="Бонус за выполнение плана, за новых клиентов…" />
          </Field>

          <div className="divider" />
          <div className="section-title">История начислений</div>
          <Card pad={false}>
            <Table
              columns={[
                { label: 'Период' },
                { label: 'За услуги', num: true },
                { label: 'Оклад', num: true },
                { label: 'Бонус', num: true },
                { label: 'Штраф', num: true },
                { label: 'Аванс', num: true },
                { label: 'Итого', num: true },
                { label: 'Статус' },
              ]}
              rows={SALARY_HISTORY}
              renderRow={(r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r.period}</td>
                  <td className="num">{r.services}</td>
                  <td className="num">{r.base}</td>
                  <td className="num" style={{ color: 'var(--green)' }}>{r.bonus}</td>
                  <td className="num" style={{ color: r.fine !== '0 ₽' ? 'var(--red)' : undefined }}>{r.fine}</td>
                  <td className="num">{r.advance}</td>
                  <td className="num" style={{ fontWeight: 700 }}>{r.total}</td>
                  <td><Badge color={r.status === 'paid' ? 'green' : 'amber'}>{r.status === 'paid' ? 'Выплачено' : 'Начислено'}</Badge></td>
                </tr>
              )}
            />
          </Card>
        </div>
      )}

      {innerTab === 'Статистика' && staff && (
        <div>
          <div className="section-title">Показатели за текущий месяц</div>
          <div className="grid grid-2" style={{ marginBottom: 16 }}>
            <Stat label="Выручка" value={staff.revenue} delta="+8%" dir="up" />
            <Stat label="Количество визитов" value={`${staff.visits}`} delta="+5" dir="up" />
            <Stat label="Средний чек" value={staff.avgCheck} delta="+3%" dir="up" />
            <Stat label="Загрузка" value={staff.load} delta="+2%" dir="up" />
            <Stat label="Повторные клиенты" value={staff.repeat} delta="+4%" dir="up" />
            <Stat label="Рейтинг" value={`${staff.rating} / 5.0`} delta="+0.1" dir="up" />
          </div>

          <div className="section-title">Отзывы клиентов</div>
          {[
            { client: 'Мария П.', text: 'Анна — настоящий профессионал, очень доволен результатом!', stars: 5 },
            { client: 'Ольга К.', text: 'Окрашивание получилось отлично, пришла снова.', stars: 5 },
            { client: 'Елена С.', text: 'Хороший мастер, но пришлось немного подождать.', stars: 4 },
          ].map((rev, i) => (
            <div key={i} className="list-line" style={{ alignItems: 'flex-start', marginBottom: 8 }}>
              <div className="avatar-sm">{rev.client.split(' ').map(c => c[0]).join('')}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{rev.client} <span className="small muted">— {'★'.repeat(rev.stars)}</span></div>
                <div className="small">{rev.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {innerTab === 'Расчётный лист' && (
        <div>
          <div className="section-title">Расчётный лист</div>
          <div className="toolbar" style={{ marginBottom: 12 }}>
            <Field label="Период"><Select options={['Июнь 2026', 'Май 2026', 'Апрель 2026']} /></Field>
            <div className="spacer" />
            <Button variant="ghost"><IcExport size={14} /> Печать</Button>
          </div>

          <KV items={PAYSLIP_ROWS} />
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
            <span>К выплате</span>
            <span>73 920 ₽</span>
          </div>
          <div className="note small" style={{ marginTop: 12 }}>
            Период: 01.06.2026 – 30.06.2026. Сформирован автоматически по схеме расчёта.
          </div>
          <Button style={{ marginTop: 12 }}>Выплатить</Button>
        </div>
      )}
    </Drawer>
  )
}
