import { useState } from 'react'
import {
  PageHead, Button, Card, Badge, Table, Field, Input,
  Drawer, Tabs,
} from '../components/ui.jsx'
import { IcExport } from '../components/icons.jsx'

// ---- мок-данные ----
const PLANS = [
  {
    id: 'start',
    name: 'Старт',
    price: 990,
    description: 'Для небольших салонов и частных мастеров',
    features: [
      '1 филиал',
      'До 5 сотрудников',
      'До 300 записей в месяц',
      'Журнал записей',
      'Telegram Mini App',
      'База клиентов',
      'Базовые уведомления',
      'E-mail поддержка',
    ],
    isCurrent: false,
  },
  {
    id: 'business',
    name: 'Бизнес',
    price: 3900,
    description: 'Оптимально для среднего бизнеса',
    features: [
      'До 5 филиалов',
      'До 20 сотрудников',
      'До 2 000 записей в месяц',
      'Всё из тарифа «Старт»',
      'Расширенная аналитика',
      'Финансовые отчёты',
      'Зарплатные схемы',
      'Интеграции (1С, Google Calendar)',
      'Приоритетная поддержка',
    ],
    isCurrent: true,
  },
  {
    id: 'network',
    name: 'Сеть',
    price: 8900,
    description: 'Для крупных сетей и франшиз',
    features: [
      'Неограниченное число филиалов',
      'Неограниченное число сотрудников',
      'Без лимита записей',
      'Всё из тарифа «Бизнес»',
      'API / вебхуки',
      'White-label брендирование',
      'Выделенный менеджер',
      'SLA 99.9%',
      'Кастомные интеграции',
    ],
    isCurrent: false,
  },
]

const PAYMENT_HISTORY = [
  { date: '01.06.2026', plan: 'Бизнес', amount: '3 900 руб.', status: 'paid', invoice: 'INV-2026-06' },
  { date: '01.05.2026', plan: 'Бизнес', amount: '3 900 руб.', status: 'paid', invoice: 'INV-2026-05' },
  { date: '01.04.2026', plan: 'Бизнес', amount: '3 900 руб.', status: 'paid', invoice: 'INV-2026-04' },
  { date: '01.03.2026', plan: 'Старт', amount: '990 руб.', status: 'paid', invoice: 'INV-2026-03' },
  { date: '01.02.2026', plan: 'Старт', amount: '990 руб.', status: 'paid', invoice: 'INV-2026-02' },
]

export default function Billing() {
  const [tab, setTab] = useState('Тарифы')
  const [planDrawer, setPlanDrawer] = useState(false)
  const [payDrawer, setPayDrawer] = useState(false)

  return (
    <>
      <PageHead
        crumbs="Тарифы и оплата"
        title="Тарифы и оплата"
        sub="Управление подпиской Dation: выбор тарифа и история оплат."
        actions={
          <>
            <Button variant="secondary" onClick={() => setPayDrawer(true)}>Способ оплаты</Button>
            <Button onClick={() => setPlanDrawer(true)}>Изменить тариф</Button>
          </>
        }
      />

      <Tabs tabs={['Тарифы', 'История оплат']} active={tab} onChange={setTab} />

      {tab === 'Тарифы' && (
        <div className="grid grid-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {plan.name}
                  {plan.isCurrent && <Badge color="blue">Текущий</Badge>}
                </div>
              }
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700 }}>{plan.price.toLocaleString()}</span>
                <span className="small muted"> руб./мес</span>
              </div>
              <p className="small muted" style={{ marginBottom: 14 }}>{plan.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, padding: '4px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--violet)', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>+</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.isCurrent ? (
                <Button variant="secondary" style={{ width: '100%' }} disabled>Активен</Button>
              ) : (
                <Button style={{ width: '100%' }} onClick={() => setPlanDrawer(true)}>Выбрать тариф</Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === 'История оплат' && (
        <Card
          title="История оплат"
          pad={false}
          actions={
            <Button size="sm" variant="ghost"><IcExport size={14} /> Экспорт</Button>
          }
        >
          <Table
            columns={['Дата', 'Тариф', 'Сумма', 'Статус', 'Действия']}
            rows={PAYMENT_HISTORY}
            renderRow={(r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.plan}</td>
                <td className="num">{r.amount}</td>
                <td>
                  <Badge color={r.status === 'paid' ? 'green' : 'amber'}>
                    {r.status === 'paid' ? 'Оплачено' : 'Ожидает'}
                  </Badge>
                </td>
                <td>
                  <Button size="sm" variant="ghost"><IcExport size={14} /> Скачать счёт</Button>
                </td>
              </tr>
            )}
          />
        </Card>
      )}

      {/* Drawer: Изменить тариф */}
      <Drawer
        title="Изменить тариф"
        open={planDrawer}
        onClose={() => setPlanDrawer(false)}
        footer={
          <>
            <Button onClick={() => setPlanDrawer(false)}>Подтвердить смену</Button>
            <Button variant="secondary" onClick={() => setPlanDrawer(false)}>Отмена</Button>
          </>
        }
      >
        <p className="muted" style={{ marginBottom: 16 }}>
          Выберите тариф. Переход на более высокий тариф произойдёт немедленно, разница спишется пропорционально. Понижение — с начала следующего расчётного периода.
        </p>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: '14px 16px',
              border: `2px solid ${plan.isCurrent ? 'var(--violet)' : 'var(--border)'}`,
              borderRadius: 10,
              marginBottom: 10,
              cursor: 'pointer',
              background: plan.isCurrent ? 'var(--violet-soft, #f5f3ff)' : '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="num">{plan.price.toLocaleString()} руб./мес</span>
                {plan.isCurrent && <Badge color="blue">Текущий</Badge>}
              </div>
            </div>
            <div className="small muted">{plan.description}</div>
          </div>
        ))}
        <div className="note small" style={{ marginTop: 8 }}>
          При вопросах по оплате обращайтесь в поддержку: support@dation.app
        </div>
      </Drawer>

      {/* Drawer: Способ оплаты */}
      <Drawer
        title="Способ оплаты"
        open={payDrawer}
        onClose={() => setPayDrawer(false)}
        footer={
          <>
            <Button onClick={() => setPayDrawer(false)}>Сохранить</Button>
            <Button variant="secondary" onClick={() => setPayDrawer(false)}>Отмена</Button>
          </>
        }
      >
        <div style={{ padding: '14px 16px', border: '2px solid var(--violet)', borderRadius: 10, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Банковская карта</div>
          <div className="small muted">•••• •••• •••• 4321 — действительна до 08/28</div>
        </div>
        <Button variant="secondary" size="sm" style={{ marginBottom: 20, width: '100%' }}>
          + Добавить новую карту
        </Button>
        <div className="divider" />
        <Field label="Получатель счёта (юридическое лицо)">
          <Input defaultValue="ООО «Красота Групп»" />
        </Field>
        <Field label="ИНН / КПП">
          <Input placeholder="7701234567 / 770101001" />
        </Field>
        <Field label="Расчётный счёт">
          <Input placeholder="40702810000000000000" />
        </Field>
        <Field label="Банк">
          <Input placeholder="АО «Тинькофф Банк»" />
        </Field>
        <p className="small muted">Счёт на оплату выставляется автоматически в начале расчётного периода и отправляется на e-mail администратора.</p>
      </Drawer>
    </>
  )
}
