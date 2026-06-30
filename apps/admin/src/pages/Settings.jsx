import { useState } from 'react'
import {
  PageHead, Button, Card, Badge, Table, Field, Input, Textarea,
  Select, Switch,
} from '../components/ui.jsx'
import { TimePicker } from '../components/TimePicker.jsx'
import { IcPlus, IcEdit, IcTrash } from '../components/icons.jsx'

// ---- мок-данные ----
const PAYMENT_METHODS = [
  { id: 1, name: 'Наличные', active: true },
  { id: 2, name: 'Банковская карта', active: true },
  { id: 3, name: 'Telegram Pay', active: false },
  { id: 4, name: 'Kaspi QR', active: true },
]

const NAV_SECTIONS = [
  'Компания',
  'Филиал',
  'Журнал',
  'Финансы',
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
                  background: section === s ? 'var(--violet-soft, #EEF2FE)' : 'transparent',
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
          {section === 'Журнал' && <SectionJournal />}
          {section === 'Финансы' && <SectionFinance />}
          {section === 'Резервные копии' && <SectionBackup />}
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

// ---- Журнал ----
function SectionJournal() {
  return (
    <Card title="Настройки журнала" actions={<Button size="sm">Сохранить</Button>}>
      <div className="grid grid-2">
        <Field label="Шаг сетки времени">
          <Select options={['5 минут', '10 минут', '15 минут', '30 минут', '60 минут']} defaultValue="15 минут" />
        </Field>
        <Field label="Начало рабочего дня"><TimePicker defaultValue="09:00" /></Field>
        <Field label="Конец рабочего дня"><TimePicker defaultValue="21:00" /></Field>
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
          ['Клиент пришёл', '#3B65F3'],
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
