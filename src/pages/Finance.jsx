import { useState } from 'react'
import { PageHead, Button, Card, Stat, Badge, Table, Field, Input, Select, Chips, Drawer, KV } from '../components/ui.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { IcPlus, IcExport } from '../components/icons.jsx'

// ─── Мок-данные ───────────────────────────────────────────────────────────────

const TX_TYPES = {
  sale_service: { label: 'Продажа услуги', color: 'green' },
  sale_goods:   { label: 'Продажа товара', color: 'green' },
  refund:       { label: 'Возврат',         color: 'red' },
  income:       { label: 'Доход',           color: 'blue' },
  expense:      { label: 'Расход',          color: 'gray' },
  deposit:      { label: 'Внесение',        color: '' },
  withdraw:     { label: 'Изъятие',         color: 'amber' },
}

const PAY_METHODS = ['Наличные', 'Карта', 'Перевод', 'Онлайн (Mini App)', 'Смешанная']


function fmt(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

const INITIAL_TRANSACTIONS = [
  { id: 1,  dt: '24.06.2026 09:45', type: 'sale_service', desc: 'Стрижка + укладка',    client: 'Мария П.',      staff: 'А. Морозова', method: 'Карта',          amount: 2400,  dir: 'in' },
  { id: 2,  dt: '24.06.2026 10:30', type: 'sale_goods',   desc: 'Шампунь Kerastase',    client: 'Мария П.',      staff: 'А. Морозова', method: 'Карта',          amount: 1890,  dir: 'in' },
  { id: 3,  dt: '24.06.2026 11:00', type: 'sale_service', desc: 'Мужская стрижка',      client: 'Артём Б.',      staff: 'И. Лебедев',  method: 'Наличные',       amount: 1200,  dir: 'in' },
  { id: 4,  dt: '24.06.2026 11:15', type: 'expense',      desc: 'Закупка расходников',  client: '—',             staff: 'Администр.',  method: 'Перевод',        amount: 4500,  dir: 'out' },
  { id: 5,  dt: '24.06.2026 12:00', type: 'sale_service', desc: 'Маникюр + покрытие',   client: 'Дарья Л.',      staff: 'С. Котова',   method: 'Онлайн (Mini App)', amount: 1800, dir: 'in' },
  { id: 6,  dt: '24.06.2026 13:20', type: 'refund',       desc: 'Возврат за пилинг',    client: 'Алёна М.',      staff: 'Д. Орлов',    method: 'Карта',          amount: 3200,  dir: 'out' },
  { id: 7,  dt: '24.06.2026 14:00', type: 'sale_service', desc: 'Окрашивание (корни)',   client: 'Ольга К.',      staff: 'А. Морозова', method: 'Смешанная',      amount: 3500,  dir: 'in' },
  { id: 8,  dt: '24.06.2026 15:30', type: 'income',       desc: 'Продажа сертификата',  client: 'Виктория З.',   staff: 'Администр.',  method: 'Карта',          amount: 5000,  dir: 'in' },
  { id: 9,  dt: '24.06.2026 16:00', type: 'deposit',      desc: 'Внесение в кассу',     client: '—',             staff: 'Администр.',  method: 'Наличные',       amount: 10000, dir: 'in' },
  { id: 10, dt: '24.06.2026 17:15', type: 'sale_service', desc: 'Наращивание ногтей',   client: 'Ксения В.',     staff: 'С. Котова',   method: 'Онлайн (Mini App)', amount: 4200, dir: 'in' },
  { id: 11, dt: '24.06.2026 18:00', type: 'withdraw',     desc: 'Изъятие для инкассо',  client: '—',             staff: 'Администр.',  method: 'Наличные',       amount: 8000,  dir: 'out' },
  { id: 12, dt: '24.06.2026 19:00', type: 'sale_service', desc: 'Стрижка',              client: 'Елена С.',      staff: 'А. Морозова', method: 'Карта',          amount: 1800,  dir: 'in' },
]

const EMPTY_TX = { dt: '24.06.2026', desc: '', method: 'Наличные', amount: '' }

// ─── Основной компонент ────────────────────────────────────────────────────────

export default function Finance() {
  return (
    <>
      <PageHead
        crumbs="Финансы"
        title="Финансы"
        sub="Учёт финансовых транзакций: доходы, расходы и оплата визитов."
      />

      <TransactionsTab />
    </>
  )
}

// ─── Вкладка «Транзакции» ─────────────────────────────────────────────────────

function TransactionsTab() {
  const [typeFilter, setTypeFilter] = useState('Все')
  const [methodFilter, setMethodFilter] = useState('Все способы')
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [payDrawer, setPayDrawer] = useState(false)
  // txDrawer: null | 'income' | 'expense'
  const [txDrawer, setTxDrawer] = useState(null)
  const [txForm, setTxForm] = useState(EMPTY_TX)
  const [rows, setRows] = useState(INITIAL_TRANSACTIONS)

  const totalIncome = rows.filter((t) => t.dir === 'in').reduce((s, t) => s + t.amount, 0)
  const totalExpense = rows.filter((t) => t.dir === 'out').reduce((s, t) => s + t.amount, 0)

  const filtered = rows.filter((t) => {
    const matchType = typeFilter === 'Все' || TX_TYPES[t.type]?.label === typeFilter
    const matchMethod = methodFilter === 'Все способы' || t.method === methodFilter
    return matchType && matchMethod
  })

  function openTxDrawer(kind) {
    setTxForm(EMPTY_TX)
    setTxDrawer(kind)
  }

  function saveTx() {
    if (!txForm.desc?.trim() || !txForm.amount) return
    const isIncome = txDrawer === 'income'
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const dt = txForm.dt
      ? `${txForm.dt} ${timeStr}`
      : `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${timeStr}`
    const newRow = {
      id: Date.now(),
      dt,
      type: isIncome ? 'income' : 'expense',
      desc: txForm.desc.trim(),
      client: '—',
      staff: 'Администр.',
      method: txForm.method || 'Наличные',
      amount: Math.abs(Number(txForm.amount)),
      dir: isIncome ? 'in' : 'out',
    }
    setRows([newRow, ...rows])
    setTxForm(EMPTY_TX)
    setTxDrawer(null)
  }

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <Stat label="Доходы за период" value={fmt(totalIncome)} delta="+11%" dir="up" />
        <Stat label="Расходы за период" value={fmt(totalExpense)} delta="-3%" dir="down" />
        <Stat label="Итого" value={fmt(totalIncome - totalExpense)} delta="+18%" dir="up" />
        <Stat label="Операций" value={`${rows.length}`} delta="+2" dir="up" />
      </div>

      <div className="toolbar">
        <Chips
          items={['Все', ...Object.values(TX_TYPES).map((t) => t.label)]}
          active={typeFilter}
          onChange={setTypeFilter}
        />
      </div>

      <div className="toolbar">
        <span className="small muted">с:</span>
        <DatePicker value={from} onChange={setFrom} style={{ width: 150 }} />
        <span className="small muted">по:</span>
        <DatePicker value={to} onChange={setTo} style={{ width: 150 }} />
        <Select
          options={['Все способы', ...PAY_METHODS]}
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          style={{ width: 170 }}
        />
        <Select options={['Все сотрудники', 'А. Морозова', 'И. Лебедев', 'С. Котова', 'Д. Орлов']} style={{ width: 170 }} />
      </div>

      <div className="toolbar">
        <Button onClick={() => openTxDrawer('income')}><IcPlus size={16} /> Доход</Button>
        <Button variant="secondary" onClick={() => openTxDrawer('expense')}><IcPlus size={16} /> Расход</Button>
        <Button variant="secondary" onClick={() => setPayDrawer(true)}>Оплата визита</Button>
        <div className="spacer" />
        <Button variant="ghost"><IcExport size={16} /> Экспорт в Excel</Button>
        <Button variant="ghost">Печать</Button>
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Дата / время' },
            { label: 'Тип' },
            { label: 'Описание / клиент' },
            { label: 'Сотрудник' },
            { label: 'Способ оплаты' },
            { label: 'Сумма', num: true },
          ]}
          rows={filtered}
          renderRow={(r, i) => (
            <tr key={i}>
              <td><span className="small muted">{r.dt}</span></td>
              <td><Badge color={TX_TYPES[r.type]?.color}>{TX_TYPES[r.type]?.label}</Badge></td>
              <td>
                <div style={{ fontWeight: 500 }}>{r.desc}</div>
                {r.client !== '—' && <div className="small muted">{r.client}</div>}
              </td>
              <td>{r.staff}</td>
              <td><span className="small">{r.method}</span></td>
              <td className="num" style={{ fontWeight: 700, color: r.dir === 'in' ? 'var(--green, #16A34A)' : 'var(--red, #DC2626)' }}>
                {r.dir === 'in' ? '+' : '−'}{fmt(r.amount)}
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Drawer: Оплата визита */}
      <PaymentDrawer open={payDrawer} onClose={() => setPayDrawer(false)} />

      {/* Drawer: Добавить доход / расход */}
      <Drawer
        open={txDrawer !== null}
        onClose={() => setTxDrawer(null)}
        title={txDrawer === 'income' ? 'Добавить доход' : 'Добавить расход'}
        footer={<>
          <Button onClick={saveTx}>Сохранить</Button>
          <Button variant="secondary" onClick={() => setTxDrawer(null)}>Отмена</Button>
        </>}
      >
        <Field label="Дата">
          <Input
            placeholder="24.06.2026"
            value={txForm.dt}
            onChange={(e) => setTxForm({ ...txForm, dt: e.target.value })}
          />
        </Field>
        {txDrawer === 'expense' && (
          <Field label="Категория расхода">
            <Select
              options={['Расходные материалы', 'Аренда', 'Зарплата', 'Реклама', 'Оборудование', 'Прочее']}
              onChange={(e) => setTxForm({ ...txForm, desc: txForm.desc || e.target.value })}
            />
          </Field>
        )}
        <Field label="Описание">
          <Input
            placeholder={txDrawer === 'income' ? 'Напр., продажа сертификата' : 'Краткое описание расхода'}
            value={txForm.desc}
            onChange={(e) => setTxForm({ ...txForm, desc: e.target.value })}
          />
        </Field>
        <Field label="Способ оплаты">
          <Select
            options={PAY_METHODS}
            value={txForm.method}
            onChange={(e) => setTxForm({ ...txForm, method: e.target.value })}
          />
        </Field>
        <Field label="Сумма">
          <Input
            type="number"
            placeholder="0"
            value={txForm.amount}
            onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
          />
        </Field>
      </Drawer>
    </>
  )
}

// ─── Drawer «Оплата визита» ───────────────────────────────────────────────────

function PaymentDrawer({ open, onClose }) {
  const [splitMethod, setSplitMethod] = useState(false)
  const [partial, setPartial] = useState(false)

  const visitItems = [
    { name: 'Стрижка женская', qty: 1, price: 1800 },
    { name: 'Окрашивание (корни)', qty: 1, price: 3500 },
    { name: 'Шампунь Kerastase', qty: 1, price: 1890 },
  ]
  const subtotal = visitItems.reduce((s, i) => s + i.price, 0)
  const discount = 500
  const total = subtotal - discount

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Оплата визита — Ольга К."
      footer={<>
        <Button>Оплатить</Button>
        <Button variant="secondary" onClick={() => setPartial(!partial)}>Частичная оплата</Button>
        <Button variant="danger">Возврат</Button>
      </>}
    >
      <div className="section-title">Состав визита</div>
      <Card pad={false}>
        <Table
          columns={[
            { label: 'Услуга / товар' },
            { label: 'Кол-во', num: true },
            { label: 'Цена', num: true },
          ]}
          rows={visitItems}
          renderRow={(r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td className="num">{r.qty}</td>
              <td className="num">{fmt(r.price)}</td>
            </tr>
          )}
        />
      </Card>

      <div className="divider" />
      <KV items={[
        ['Подытог', fmt(subtotal)],
        ['Скидка (постоянный клиент)', `−${fmt(discount)}`],
        ['Итого к оплате', fmt(total)],
      ]} />

      <div className="divider" />
      <div className="section-title">Способ оплаты</div>

      <div className="list-line" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 500 }}>Разбить на несколько способов</span>
        <input type="checkbox" checked={splitMethod} onChange={() => setSplitMethod(!splitMethod)} style={{ width: 18, height: 18 }} />
      </div>

      {!splitMethod ? (
        <Field label="Способ оплаты">
          <Select options={PAY_METHODS} />
        </Field>
      ) : (
        <>
          {PAY_METHODS.slice(0, 3).map((m, i) => (
            <div key={i} className="grid grid-2">
              <Field label={m}><Input type="number" placeholder="0" /></Field>
            </div>
          ))}
          <div className="note small">Суммарно: введите {fmt(total)}</div>
        </>
      )}

      {partial && (
        <>
          <div className="divider" />
          <div className="section-title">Частичная оплата</div>
          <Field label="Сумма к оплате сейчас"><Input type="number" placeholder={String(total)} /></Field>
          <Field label="Способ"><Select options={PAY_METHODS} /></Field>
          <div className="note small">Остаток будет зафиксирован как долг клиента.</div>
        </>
      )}
    </Drawer>
  )
}

