import { useState } from 'react'
import {
  PageHead, Button, Card, Badge, Table, Field, Input, Textarea,
  Select, Switch, Checkbox, Chips, Drawer,
} from '../components/ui.jsx'
import { IcPlus, IcEdit, IcTrash } from '../components/icons.jsx'

// ---- мок-данные ----
const INITIAL_USERS = [
  { id: 1, name: 'Алина Смирнова', contact: 'alina@salon.ru', position: 'Администратор', branches: ['Центр'], status: 'active' },
  { id: 2, name: 'Игорь Лебедев', contact: '+7 900 123-45-67', position: 'Барбер', branches: ['Центр', 'Север'], status: 'active' },
  { id: 3, name: 'Светлана Котова', contact: 'kotova@salon.ru', position: 'Мастер маникюра', branches: ['Север'], status: 'active' },
  { id: 4, name: 'Дмитрий Орлов', contact: '+7 911 000-11-22', position: 'Косметолог', branches: ['Центр'], status: 'blocked' },
]

const ACCESS_SECTIONS = [
  'Журнал записей', 'Telegram Mini App', 'Клиенты (CRM)', 'Услуги',
  'Сотрудники', 'Финансы', 'Склад', 'Уведомления',
  'Аналитика и отчёты', 'Настройки', 'Филиалы / Сеть', 'Тарифы и оплата',
]

const PAYMENT_METHODS = [
  { id: 1, name: 'Наличные', active: true },
  { id: 2, name: 'Банковская карта', active: true },
  { id: 3, name: 'Telegram Pay', active: false },
  { id: 4, name: 'Kaspi QR', active: true },
]

const INITIAL_SALARY_SCHEMES = [
  { id: 1, name: 'Базовая ставка + %', desc: 'Фиксированная ставка и процент с продаж' },
  { id: 2, name: 'Только процент', desc: '30% от стоимости оказанных услуг' },
  { id: 3, name: 'Оклад', desc: 'Фиксированный оклад без процентов' },
]

const EMPTY_SCHEME = { name: '', type: 'Фиксированный оклад', rate: '', percent: '', goodsPercent: '' }

const AUDIT_LOG = [
  { time: '24.06.2026 11:42', user: 'Алина Смирнова', action: 'Изменён статус записи → Подтверждён', ip: '192.168.1.5' },
  { time: '24.06.2026 10:15', user: 'Игорь Лебедев', action: 'Добавлен клиент Мария Петрова', ip: '192.168.1.8' },
  { time: '23.06.2026 18:00', user: 'Администратор', action: 'Изменены настройки доступа пользователя Дмитрий Орлов', ip: '192.168.1.1' },
  { time: '23.06.2026 16:30', user: 'Светлана Котова', action: 'Создана запись на 24.06.2026 14:00', ip: '192.168.1.9' },
]

const NAV_SECTIONS = [
  'Компания',
  'Филиал',
  'Пользователи и доступы',
  'Журнал',
  'Услуги / Категории',
  'Telegram Mini App и бот',
  'Уведомления / шаблоны',
  'Финансы',
  'Зарплатные схемы',
  'Резервные копии',
]

export default function Settings() {
  const [section, setSection] = useState('Компания')

  return (
    <>
      <PageHead
        crumbs="Настройки"
        title="Настройки"
        sub="Управление параметрами компании, доступами и системными настройками."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Левое меню */}
        <Card pad={false}>
          <nav>
            {NAV_SECTIONS.map((s) => (
              <div
                key={s}
                onClick={() => setSection(s)}
                style={{
                  padding: '10px 18px',
                  cursor: 'pointer',
                  fontWeight: section === s ? 600 : 400,
                  color: section === s ? 'var(--violet)' : 'var(--text)',
                  background: section === s ? 'var(--violet-soft, #f5f3ff)' : 'transparent',
                  borderLeft: section === s ? '3px solid var(--violet)' : '3px solid transparent',
                  fontSize: 14,
                }}
              >
                {s}
              </div>
            ))}
          </nav>
        </Card>

        {/* Правая панель */}
        <div>
          {section === 'Компания' && <SectionCompany />}
          {section === 'Филиал' && <SectionBranch />}
          {section === 'Пользователи и доступы' && <SectionUsers />}
          {section === 'Журнал' && <SectionJournal />}
          {section === 'Финансы' && <SectionFinance />}
          {section === 'Зарплатные схемы' && <SectionSalary />}
          {section === 'Резервные копии' && <SectionBackup />}
          {['Услуги / Категории', 'Telegram Mini App и бот', 'Уведомления / шаблоны'].includes(section) && (
            <Card title={section}>
              <p className="muted">Раздел управляется из отдельного модуля меню. Перейдите через левое меню приложения.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

// ---- Компания ----
function SectionCompany() {
  return (
    <Card title="Реквизиты компании" actions={<Button size="sm">Сохранить</Button>}>
      <div className="grid grid-2">
        <Field label="Название компании"><Input defaultValue="Beauty Studio «Аура»" /></Field>
        <Field label="ИНН / БИН"><Input defaultValue="770123456789" /></Field>
        <Field label="Юридический адрес"><Input defaultValue="г. Москва, ул. Ленина, 12" /></Field>
        <Field label="Телефон компании"><Input defaultValue="+7 495 000-00-00" /></Field>
        <Field label="E-mail компании"><Input defaultValue="info@aura-salon.ru" /></Field>
        <Field label="Сайт"><Input defaultValue="aura-salon.ru" /></Field>
      </div>
      <div className="divider" />
      <div className="grid grid-3">
        <Field label="Часовой пояс">
          <Select options={['UTC+3 Москва', 'UTC+5 Екатеринбург', 'UTC+6 Омск', 'UTC+7 Красноярск']} />
        </Field>
        <Field label="Валюта">
          <Select options={['RUB — Российский рубль', 'KZT — Тенге', 'UZS — Узбекский сум', 'USD — Доллар']} />
        </Field>
        <Field label="Язык интерфейса">
          <Select options={['Русский', 'Казахский', 'Узбекский', 'English']} />
        </Field>
      </div>
      <div className="divider" />
      <Field label="Логотип компании">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, background: 'var(--bg-soft)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)' }}>Лого</div>
          <Button variant="secondary" size="sm">Загрузить изображение</Button>
        </div>
      </Field>
    </Card>
  )
}

// ---- Филиал ----
function SectionBranch() {
  return (
    <Card title="Настройки филиала" actions={<Button size="sm">Сохранить</Button>}>
      <div className="grid grid-2">
        <Field label="Название филиала"><Input defaultValue="Центральный" /></Field>
        <Field label="Адрес"><Input defaultValue="г. Москва, ул. Арбат, 5" /></Field>
        <Field label="Телефон"><Input defaultValue="+7 495 111-22-33" /></Field>
        <Field label="E-mail"><Input defaultValue="center@aura-salon.ru" /></Field>
      </div>
      <div className="divider" />
      <div className="section-title">График работы</div>
      <div className="grid grid-2">
        <Field label="Будни (Пн–Пт)"><Input defaultValue="09:00 – 21:00" /></Field>
        <Field label="Выходные (Сб–Вс)"><Input defaultValue="10:00 – 20:00" /></Field>
      </div>
      <div className="divider" />
      <Field label="Праздничные и нерабочие дни">
        <Textarea defaultValue="01.01, 07.01, 23.02, 08.03, 01.05, 09.05, 12.06, 04.11" />
      </Field>
      <p className="small muted">Перечислите даты через запятую. В эти дни онлайн-запись будет закрыта.</p>
    </Card>
  )
}

const EMPTY_INVITE = { name: '', contact: '', position: '', branch: 'Центральный' }

// ---- Пользователи и доступы ----
function SectionUsers() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [accessDrawer, setAccessDrawer] = useState(null)
  const [auditDrawer, setAuditDrawer] = useState(false)
  const [inviteDrawer, setInviteDrawer] = useState(false)
  const [form, setForm] = useState(EMPTY_INVITE)

  const [accessMap, setAccessMap] = useState(() => {
    const map = {}
    INITIAL_USERS.forEach((u) => {
      map[u.id] = ACCESS_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: true }), {})
    })
    return map
  })
  const [visibilityMap, setVisibilityMap] = useState(() => {
    const map = {}
    INITIAL_USERS.forEach((u) => { map[u.id] = 'Весь филиал' })
    return map
  })

  const toggleSection = (userId, sec) => {
    setAccessMap((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [sec]: !prev[userId][sec] },
    }))
  }

  const handleInviteSave = () => {
    if (!form.name?.trim()) return
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      contact: form.contact,
      position: form.position,
      branches: [form.branch],
      status: 'active',
    }
    setUsers([newUser, ...users])
    setAccessMap((prev) => ({
      ...prev,
      [newUser.id]: ACCESS_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: true }), {}),
    }))
    setVisibilityMap((prev) => ({ ...prev, [newUser.id]: 'Весь филиал' }))
    setForm(EMPTY_INVITE)
    setInviteDrawer(false)
  }

  return (
    <>
      <Card
        title="Пользователи и доступы"
        actions={
          <>
            <Button size="sm" variant="secondary" onClick={() => setAuditDrawer(true)}>Журнал действий</Button>
            <Button size="sm" onClick={() => setInviteDrawer(true)}><IcPlus size={14} /> Пригласить</Button>
          </>
        }
      >
        <div className="note small" style={{ marginBottom: 16 }}>
          Доступом управляет владелец индивидуально по каждому разделу. Предустановленных ролей нет.
        </div>
        <Table
          columns={['Имя', 'Контакт', 'Должность', 'Филиал(ы)', 'Статус', 'Действия']}
          rows={users}
          renderRow={(u, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td className="small muted">{u.contact}</td>
              <td>{u.position}</td>
              <td className="small">{u.branches.join(', ')}</td>
              <td>
                <Badge color={u.status === 'active' ? 'green' : 'red'}>
                  {u.status === 'active' ? 'Активен' : 'Заблокирован'}
                </Badge>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="secondary" onClick={() => setAccessDrawer(u)}>Настроить доступ</Button>
                  <Button size="sm" variant="ghost">Сбросить пароль</Button>
                  <Button size="sm" variant="danger">{u.status === 'active' ? 'Заблокировать' : 'Разблокировать'}</Button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Drawer: Настроить доступ */}
      <Drawer
        title={accessDrawer ? `Доступ: ${accessDrawer.name}` : ''}
        open={!!accessDrawer}
        onClose={() => setAccessDrawer(null)}
        footer={
          <>
            <Button onClick={() => setAccessDrawer(null)}>Сохранить</Button>
            <Button variant="secondary" onClick={() => setAccessDrawer(null)}>Отмена</Button>
          </>
        }
      >
        {accessDrawer && (
          <>
            <div className="note small" style={{ marginBottom: 16 }}>
              Доступом управляет владелец индивидуально по каждому разделу. Предустановленных ролей нет.
            </div>

            <div className="section-title" style={{ marginBottom: 10 }}>Разделы меню</div>
            {ACCESS_SECTIONS.map((sec) => (
              <div key={sec} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <Checkbox
                  label={sec}
                  checked={accessMap[accessDrawer.id]?.[sec] ?? true}
                  onChange={() => toggleSection(accessDrawer.id, sec)}
                />
              </div>
            ))}

            <div className="divider" />

            <Field label="Привязка к филиалам">
              <Select options={['Центральный', 'Северный', 'Все филиалы']} />
            </Field>

            <Field label="Видимость данных">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                <Chips
                  items={['Только свои записи', 'Весь филиал', 'Вся сеть']}
                  active={visibilityMap[accessDrawer.id]}
                  onChange={(v) => setVisibilityMap((prev) => ({ ...prev, [accessDrawer.id]: v }))}
                />
              </div>
            </Field>
          </>
        )}
      </Drawer>

      {/* Drawer: Журнал действий */}
      <Drawer
        title="Журнал действий пользователей"
        open={auditDrawer}
        onClose={() => setAuditDrawer(false)}
        footer={<Button variant="secondary" onClick={() => setAuditDrawer(false)}>Закрыть</Button>}
      >
        <Table
          columns={['Время', 'Пользователь', 'Действие', 'IP']}
          rows={AUDIT_LOG}
          renderRow={(r, i) => (
            <tr key={i}>
              <td className="small muted">{r.time}</td>
              <td style={{ fontWeight: 600 }}>{r.user}</td>
              <td className="small">{r.action}</td>
              <td className="small faint">{r.ip}</td>
            </tr>
          )}
        />
      </Drawer>

      {/* Drawer: Пригласить пользователя */}
      <Drawer
        title="Пригласить пользователя"
        open={inviteDrawer}
        onClose={() => { setInviteDrawer(false); setForm(EMPTY_INVITE) }}
        footer={
          <>
            <Button onClick={handleInviteSave}>Отправить приглашение</Button>
            <Button variant="secondary" onClick={() => { setInviteDrawer(false); setForm(EMPTY_INVITE) }}>Отмена</Button>
          </>
        }
      >
        <Field label="Имя">
          <Input
            placeholder="Полное имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="E-mail или телефон">
          <Input
            placeholder="Введите контакт для отправки приглашения"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </Field>
        <Field label="Должность (текст в профиле)">
          <Input
            placeholder="Например: Администратор, Мастер, Бухгалтер"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </Field>
        <Field label="Филиал(ы)">
          <Select
            options={['Центральный', 'Северный', 'Все филиалы']}
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          />
        </Field>
        <p className="small muted">Пользователь получит ссылку для входа. Доступ к разделам настраивается отдельно.</p>
      </Drawer>
    </>
  )
}

// ---- Журнал ----
function SectionJournal() {
  return (
    <Card title="Настройки журнала" actions={<Button size="sm">Сохранить</Button>}>
      <div className="grid grid-2">
        <Field label="Шаг сетки времени">
          <Select options={['5 минут', '10 минут', '15 минут', '30 минут', '60 минут']} defaultValue="15 минут" />
        </Field>
        <Field label="Начало рабочего дня"><Input type="time" defaultValue="09:00" /></Field>
        <Field label="Конец рабочего дня"><Input type="time" defaultValue="21:00" /></Field>
        <Field label="Правило записи">
          <Select options={['Без подтверждения', 'Требует подтверждения администратором']} />
        </Field>
      </div>
      <div className="divider" />
      <div className="section-title">Цвета статусов</div>
      <div className="grid grid-2">
        {[
          ['Ожидает подтверждения', '#F59E0B'],
          ['Подтверждён', '#3B82F6'],
          ['Клиент пришёл', '#7C3AED'],
          ['Услуга оказана', '#16A34A'],
          ['Не пришёл', '#EF4444'],
          ['Отменён', '#9CA3AF'],
        ].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: color, flexShrink: 0 }} />
            <span className="small">{label}</span>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div className="section-title">Ресурсы / кабинеты</div>
      {['Кресло 1', 'Кресло 2', 'Кабинет косметолога', 'Кабинет массажа'].map((r) => (
        <div key={r} className="list-line">
          <span>{r}</span>
          <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
          <Button size="sm" variant="ghost"><IcTrash size={14} /></Button>
        </div>
      ))}
      <Button size="sm" variant="secondary" style={{ marginTop: 8 }}><IcPlus size={14} /> Добавить ресурс</Button>
    </Card>
  )
}

// ---- Финансы ----
function SectionFinance() {
  const [methods, setMethods] = useState(PAYMENT_METHODS)
  const toggleMethod = (id) => setMethods((m) => m.map((x) => x.id === id ? { ...x, active: !x.active } : x))

  return (
    <div className="grid">
      <Card title="Способы оплаты" actions={<Button size="sm"><IcPlus size={14} /> Добавить</Button>}>
        {methods.map((m) => (
          <div key={m.id} className="list-line">
            <span style={{ flex: 1 }}>{m.name}</span>
            <Switch on={m.active} onClick={() => toggleMethod(m.id)} />
          </div>
        ))}
      </Card>

      <Card title="Статьи доходов" actions={<Button size="sm"><IcPlus size={14} /> Добавить</Button>}>
        {['Услуги', 'Продажа товаров', 'Прочие доходы'].map((s) => (
          <div key={s} className="list-line">
            <span style={{ flex: 1 }}>{s}</span>
            <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
          </div>
        ))}
      </Card>

      <Card title="Статьи расходов" actions={<Button size="sm"><IcPlus size={14} /> Добавить</Button>}>
        {['Аренда', 'Закупка материалов', 'Зарплата', 'Коммунальные услуги', 'Маркетинг'].map((s) => (
          <div key={s} className="list-line">
            <span style={{ flex: 1 }}>{s}</span>
            <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
          </div>
        ))}
      </Card>

      <Card title="Налоги">
        <div className="grid grid-2">
          <Field label="Ставка НДС (%)"><Input defaultValue="0" /></Field>
          <Field label="Режим налогообложения">
            <Select options={['УСН (доходы)', 'УСН (доходы-расходы)', 'ОСНО', 'Самозанятый']} />
          </Field>
        </div>
        <Button size="sm" style={{ marginTop: 12 }}>Сохранить</Button>
      </Card>
    </div>
  )
}

// ---- Зарплатные схемы ----
function SectionSalary() {
  const [schemes, setSchemes] = useState(INITIAL_SALARY_SCHEMES)
  const [schemeDrawer, setSchemeDrawer] = useState(false)
  const [form, setForm] = useState(EMPTY_SCHEME)

  const handleSchemeSave = () => {
    if (!form.name?.trim()) return
    const desc = [
      form.type,
      form.rate ? `Ставка: ${form.rate} руб./мес` : '',
      form.percent ? `${form.percent}% с услуг` : '',
      form.goodsPercent ? `${form.goodsPercent}% с товаров` : '',
    ].filter(Boolean).join(', ')
    setSchemes([{ id: Date.now(), name: form.name.trim(), desc }, ...schemes])
    setForm(EMPTY_SCHEME)
    setSchemeDrawer(false)
  }

  return (
    <Card title="Зарплатные схемы" actions={<Button size="sm" onClick={() => setSchemeDrawer(true)}><IcPlus size={14} /> Добавить схему</Button>}>
      {schemes.map((s) => (
        <div key={s.id} className="list-line">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{s.name}</div>
            <div className="small muted">{s.desc}</div>
          </div>
          <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
          <Button size="sm" variant="ghost"><IcTrash size={14} /></Button>
        </div>
      ))}
      <p className="small muted" style={{ marginTop: 12 }}>
        Схемы привязываются к сотрудникам в разделе «Сотрудники». Расчёт зарплаты за период доступен в разделе «Финансы».
      </p>

      <Drawer
        title="Новая зарплатная схема"
        open={schemeDrawer}
        onClose={() => { setSchemeDrawer(false); setForm(EMPTY_SCHEME) }}
        footer={
          <>
            <Button onClick={handleSchemeSave}>Сохранить</Button>
            <Button variant="secondary" onClick={() => { setSchemeDrawer(false); setForm(EMPTY_SCHEME) }}>Отмена</Button>
          </>
        }
      >
        <Field label="Название схемы">
          <Input
            placeholder="Например: Мастера (40% + ставка)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Тип расчёта">
          <Select
            options={['Фиксированный оклад', 'Только процент с продаж', 'Ставка + процент']}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
        </Field>
        <div className="grid grid-2">
          <Field label="Фиксированная ставка (руб./мес)">
            <Input
              placeholder="0"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />
          </Field>
          <Field label="Процент с услуг (%)">
            <Input
              placeholder="0"
              value={form.percent}
              onChange={(e) => setForm({ ...form, percent: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Процент с продажи товаров (%)">
          <Input
            placeholder="0"
            value={form.goodsPercent}
            onChange={(e) => setForm({ ...form, goodsPercent: e.target.value })}
          />
        </Field>
      </Drawer>
    </Card>
  )
}

// ---- Резервные копии ----
function SectionBackup() {
  return (
    <div className="grid">
      <Card title="Резервные копии" actions={<Button size="sm">Создать копию</Button>}>
        <Table
          columns={['Дата', 'Размер', 'Статус', 'Действия']}
          rows={[
            { date: '24.06.2026 03:00', size: '14.2 МБ', status: 'Успешно' },
            { date: '23.06.2026 03:00', size: '13.8 МБ', status: 'Успешно' },
            { date: '22.06.2026 03:00', size: '13.5 МБ', status: 'Успешно' },
          ]}
          renderRow={(r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td className="small muted">{r.size}</td>
              <td><Badge color="green">{r.status}</Badge></td>
              <td><Button size="sm" variant="ghost">Скачать</Button></td>
            </tr>
          )}
        />
        <p className="small muted" style={{ marginTop: 12 }}>Автоматическое резервное копирование выполняется ежедневно в 03:00.</p>
      </Card>

      <Card title="Экспорт данных">
        <p className="muted">Скачайте полный экспорт данных в форматах CSV или JSON.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button variant="secondary" size="sm">Экспорт клиентов (CSV)</Button>
          <Button variant="secondary" size="sm">Экспорт записей (CSV)</Button>
          <Button variant="secondary" size="sm">Экспорт финансов (CSV)</Button>
          <Button variant="secondary" size="sm">Полный дамп (JSON)</Button>
        </div>
      </Card>
    </div>
  )
}
