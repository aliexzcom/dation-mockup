import { useState, useEffect } from 'react'
import { PageHead, Button, Card, Stat, Badge, Table, Field, Input, Textarea, Select, Chips, Drawer, KV } from '../components/ui.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { IcPlus, IcExport, IcEdit, IcTrash, IcArrowDownLeft, IcArrowUpRight, IcArrowSwap, IcClock, IcMoney, IcUsers } from '../components/icons.jsx'

// ─── Модель операции (pair-entry, по мотивам Evo POS) ──────────────────────────
// Каждая операция двигает сумму от источника к получателю. Вид операции —
// производный от типов сторон, а не хранится отдельно (как в evolution).
//   safe → safe   = перевод (инкассация, размен)
//   X    → safe   = приход (оплата визита, продажа, внесение)
//   safe → X      = расход (закупка, аренда, выплата ЗП, возврат клиенту)
//   X    → X      = начисление (бух. проводка без движения денег)
// Тип стороны: 'safe' — касса/сейф; 'cp' — контрагент (клиент, поставщик, сотрудник).

const SAFES = [
  { id: 'safe_main', type: 'safe', name: 'Касса основная' },
  { id: 'safe_box', type: 'safe', name: 'Сейф' },
  { id: 'safe_reg2', type: 'safe', name: 'Касса №2' },
]

const COUNTERPARTIES = [
  { id: 'cp_client', type: 'cp', name: 'Клиент (визит)' },
  { id: 'cp_kerastase', type: 'cp', name: 'Поставщик «Kerastase»' },
  { id: 'cp_landlord', type: 'cp', name: 'Арендодатель' },
  { id: 'cp_morozova', type: 'cp', name: 'А. Морозова (сотрудник)' },
  { id: 'cp_kotova', type: 'cp', name: 'С. Котова (сотрудник)' },
  { id: 'cp_payroll', type: 'cp', name: 'Фонд оплаты труда' },
  { id: 'cp_tax', type: 'cp', name: 'Налоговая' },
]

const ALL_ENTITIES = [...SAFES, ...COUNTERPARTIES]
const entityById = (id) => ALL_ENTITIES.find((e) => e.id === id)
const entitiesForType = (t) => (t === 'safe' ? SAFES : COUNTERPARTIES)
const ENTITY_LABEL = { safe: 'касса', cp: 'контрагент' }
const entityIcon = (type) => (type === 'safe' ? IcMoney : IcUsers)

// Виды операций
const KIND = {
  in: { label: 'Приход', color: 'green', sign: '+' },
  out: { label: 'Расход', color: 'red', sign: '−' },
  transfer: { label: 'Перевод', color: 'gray', sign: '' },
  accrual: { label: 'Начисление', color: 'blue', sign: '' },
}
const KIND_BY_LABEL = { Приход: 'in', Расход: 'out', Перевод: 'transfer', Начисление: 'accrual' }
// Типы сторон по виду — для формы создания: [источник, получатель]
const KIND_SIDES = { in: ['cp', 'safe'], out: ['safe', 'cp'], transfer: ['safe', 'safe'], accrual: ['cp', 'cp'] }

function txKind(srcType, dstType) {
  const s = srcType === 'safe'
  const d = dstType === 'safe'
  if (s && d) return 'transfer'
  if (!s && d) return 'in'
  if (s && !d) return 'out'
  return 'accrual'
}

function kindIcon(kind) {
  switch (kind) {
    case 'in': return IcArrowDownLeft
    case 'out': return IcArrowUpRight
    case 'transfer': return IcArrowSwap
    default: return IcClock
  }
}

// Статусы документа — единая тройка проекта
const STATUS = {
  draft: { label: 'Черновик', color: 'amber' },
  published: { label: 'Опубликовано', color: 'green' },
  cancelled: { label: 'Отменено', color: 'gray' },
}

const PAY_METHODS = ['Наличные', 'Карта', 'Перевод', 'Онлайн (Mini App)', 'Смешанная']

const fmt = (n) => n.toLocaleString('ru-RU') + ' ₽'
const amountColor = (kind) =>
  kind === 'in' ? 'var(--green, #16A34A)' : kind === 'out' ? 'var(--red, #DC2626)' : 'inherit'

const two = (n) => String(n).padStart(2, '0')
function todayDt() {
  const d = new Date()
  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()} ${two(d.getHours())}:${two(d.getMinutes())}`
}
function buildDt(dateStr, fallback) {
  if (!dateStr) return fallback
  const [y, m, d] = dateStr.split('-')
  const t = new Date()
  return `${d}.${m}.${y} ${two(t.getHours())}:${two(t.getMinutes())}`
}

// Ссылка на сущность (EntityRef)
const R = (id) => {
  const e = entityById(id)
  return { type: e.type, id: e.id, name: e.name }
}

const INITIAL_OPS = [
  { id: 1, dt: '24.06.2026 09:45', source: R('cp_client'), recipient: R('safe_main'), amount: 2400, status: 'published', method: 'Карта', desc: 'Стрижка + укладка', isSystem: true, ref: 'Чек SALE-0042' },
  { id: 2, dt: '24.06.2026 10:30', source: R('cp_client'), recipient: R('safe_main'), amount: 1890, status: 'published', method: 'Карта', desc: 'Продажа: Шампунь Kerastase', isSystem: true, ref: 'Чек SALE-0043' },
  { id: 3, dt: '24.06.2026 11:00', source: R('cp_client'), recipient: R('safe_main'), amount: 1200, status: 'published', method: 'Наличные', desc: 'Мужская стрижка', isSystem: true, ref: 'Чек SALE-0044' },
  { id: 4, dt: '24.06.2026 11:15', source: R('safe_main'), recipient: R('cp_kerastase'), amount: 4500, status: 'published', method: 'Перевод', desc: 'Закупка расходников', comment: 'Краситель, окислитель, фольга' },
  { id: 5, dt: '24.06.2026 12:00', source: R('cp_client'), recipient: R('safe_reg2'), amount: 1800, status: 'published', method: 'Онлайн (Mini App)', desc: 'Маникюр + покрытие', isSystem: true, ref: 'Чек SALE-0045' },
  { id: 6, dt: '24.06.2026 13:20', source: R('safe_main'), recipient: R('cp_client'), amount: 3200, status: 'published', method: 'Карта', desc: 'Возврат за пилинг', comment: 'Клиент недоволен результатом' },
  { id: 7, dt: '24.06.2026 14:00', source: R('cp_client'), recipient: R('safe_main'), amount: 3500, status: 'published', method: 'Смешанная', desc: 'Окрашивание (корни)', isSystem: true, ref: 'Чек SALE-0046' },
  { id: 8, dt: '24.06.2026 16:00', source: R('safe_main'), recipient: R('safe_box'), amount: 10000, status: 'published', method: 'Наличные', desc: 'Инкассация в сейф' },
  { id: 9, dt: '24.06.2026 17:00', source: R('cp_payroll'), recipient: R('cp_morozova'), amount: 25000, status: 'published', method: '—', desc: 'Начисление ЗП за июнь' },
  { id: 10, dt: '24.06.2026 17:30', source: R('safe_main'), recipient: R('cp_morozova'), amount: 25000, status: 'published', method: 'Наличные', desc: 'Выплата ЗП' },
  { id: 11, dt: '25.06.2026 09:00', source: R('safe_main'), recipient: R('cp_landlord'), amount: 35000, status: 'draft', method: 'Перевод', desc: 'Аренда за июль', comment: 'Оплатить до 1 числа' },
  { id: 12, dt: '23.06.2026 20:00', source: R('safe_box'), recipient: R('safe_reg2'), amount: 5000, status: 'cancelled', method: 'Наличные', desc: 'Размен для кассы №2' },
]

// ─── Страница ──────────────────────────────────────────────────────────────────

export default function Finance() {
  return (
    <>
      <PageHead
        crumbs="Финансы"
        title="Финансы"
        sub="Операции: приходы, расходы, переводы и начисления."
      />
      <OperationsTab />
    </>
  )
}

function OperationsTab() {
  const [rows, setRows] = useState(INITIAL_OPS)
  const [kindFilter, setKindFilter] = useState('Все')
  const [statusFilter, setStatusFilter] = useState('Все статусы')
  const [methodFilter, setMethodFilter] = useState('Все способы')
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [selected, setSelected] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [payDrawer, setPayDrawer] = useState(false)

  const filtered = rows.filter((t) => {
    const kind = txKind(t.source.type, t.recipient.type)
    if (kindFilter !== 'Все' && KIND[kind].label !== kindFilter) return false
    if (statusFilter !== 'Все статусы' && STATUS[t.status].label !== statusFilter) return false
    if (methodFilter !== 'Все способы' && t.method !== methodFilter) return false
    const q = search.trim().toLowerCase()
    if (q && !(
      t.desc.toLowerCase().includes(q) ||
      t.source.name.toLowerCase().includes(q) ||
      t.recipient.name.toLowerCase().includes(q)
    )) return false
    return true
  })

  // Сводка считается только по проведённым операциям.
  let inflow = 0
  let outflow = 0
  for (const t of filtered) {
    if (t.status !== 'published') continue
    const kind = txKind(t.source.type, t.recipient.type)
    if (kind === 'in') inflow += t.amount
    if (kind === 'out') outflow += t.amount
  }
  const net = inflow - outflow

  function publish(id) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'published' } : r)))
    setSelected((s) => (s && s.id === id ? { ...s, status: 'published' } : s))
  }
  function cancelOp(id) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)))
    setSelected((s) => (s && s.id === id ? { ...s, status: 'cancelled' } : s))
  }
  function deleteDraft(id) {
    setRows((rs) => rs.filter((r) => r.id !== id))
    setSelected(null)
  }
  function startEdit(row) {
    setSelected(null)
    setEditRow(row)
    setCreateOpen(true)
  }
  function startCreate() {
    setEditRow(null)
    setCreateOpen(true)
  }
  function saveOp(row, isEdit) {
    if (isEdit) setRows((rs) => rs.map((r) => (r.id === row.id ? row : r)))
    else setRows((rs) => [row, ...rs])
    setCreateOpen(false)
    setEditRow(null)
  }

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <Stat label="Приход за период" value={fmt(inflow)} delta="+11%" dir="up" />
        <Stat label="Расход за период" value={fmt(outflow)} delta="-3%" dir="down" />
        <Stat label="Чистый поток" value={`${net >= 0 ? '+' : '−'}${fmt(Math.abs(net))}`} delta="+18%" dir={net >= 0 ? 'up' : 'down'} />
        <Stat label="Операций" value={`${filtered.length}`} delta={`из ${rows.length}`} />
      </div>

      <div className="toolbar">
        <Chips
          items={['Все', 'Приход', 'Расход', 'Перевод', 'Начисление']}
          active={kindFilter}
          onChange={setKindFilter}
        />
      </div>

      <div className="toolbar">
        <Input
          placeholder="Поиск по назначению, кассе, контрагенту"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
        <Select
          options={['Все статусы', ...Object.values(STATUS).map((s) => s.label)]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 160 }}
        />
        <Select
          options={['Все способы', ...PAY_METHODS]}
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          style={{ width: 170 }}
        />
        <span className="small muted">с:</span>
        <DatePicker value={from} onChange={setFrom} style={{ width: 140 }} />
        <span className="small muted">по:</span>
        <DatePicker value={to} onChange={setTo} style={{ width: 140 }} />
      </div>

      <div className="toolbar">
        <Button onClick={startCreate}><IcPlus size={16} /> Новая операция</Button>
        <Button variant="secondary" onClick={() => setPayDrawer(true)}>Оплата визита</Button>
        <div className="spacer" />
        <Button variant="ghost"><IcExport size={16} /> Экспорт в Excel</Button>
        <Button variant="ghost">Печать</Button>
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Дата / время' },
            { label: 'Вид' },
            { label: 'Назначение / поток' },
            { label: 'Способ' },
            { label: 'Статус' },
            { label: 'Сумма', num: true },
          ]}
          rows={filtered}
          renderRow={(r) => {
            const kind = txKind(r.source.type, r.recipient.type)
            const k = KIND[kind]
            return (
              <tr
                key={r.id}
                style={{ cursor: 'pointer', opacity: r.status === 'cancelled' ? 0.55 : 1 }}
                onClick={() => setSelected(r)}
              >
                <td><span className="small muted">{r.dt}</span></td>
                <td><KindTag kind={kind} /></td>
                <td>
                  <div style={{ fontWeight: 500 }}>{r.desc}</div>
                  <div className="small muted">{r.source.name} → {r.recipient.name}</div>
                </td>
                <td><span className="small">{r.method}</span></td>
                <td><Badge color={STATUS[r.status].color}>{STATUS[r.status].label}</Badge></td>
                <td className="num" style={{ fontWeight: 700, color: amountColor(kind) }}>
                  {k.sign}{fmt(r.amount)}
                </td>
              </tr>
            )
          }}
        />
      </Card>

      <OpDetailDrawer
        row={selected}
        onClose={() => setSelected(null)}
        onPublish={publish}
        onCancel={cancelOp}
        onDelete={deleteDraft}
        onEdit={startEdit}
      />

      <CreateOpDrawer
        open={createOpen}
        editRow={editRow}
        onClose={() => { setCreateOpen(false); setEditRow(null) }}
        onSave={saveOp}
      />

      <PaymentDrawer open={payDrawer} onClose={() => setPayDrawer(false)} />
    </>
  )
}

// ─── Метка вида операции (иконка + бейдж) ──────────────────────────────────────

function KindTag({ kind }) {
  const k = KIND[kind]
  const Ico = kindIcon(kind)
  return (
    <Badge color={k.color}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Ico size={12} /> {k.label}
      </span>
    </Badge>
  )
}

// ─── Карточка операции ─────────────────────────────────────────────────────────

function OpDetailDrawer({ row, onClose, onPublish, onCancel, onDelete, onEdit }) {
  const open = !!row
  const kind = row ? txKind(row.source.type, row.recipient.type) : 'in'
  const k = KIND[kind]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={row ? k.label : ''}
      footer={row && (
        <>
          {row.status === 'draft' && (
            <>
              <Button onClick={() => onPublish(row.id)}>Опубликовать</Button>
              <Button variant="secondary" onClick={() => onEdit(row)}><IcEdit size={14} /> Редактировать</Button>
              <Button variant="danger" onClick={() => onDelete(row.id)}><IcTrash size={14} /> Удалить черновик</Button>
            </>
          )}
          {row.status === 'published' && (
            <Button variant="secondary" onClick={() => onCancel(row.id)}>Отменить операцию</Button>
          )}
          {row.status === 'cancelled' && <span className="small muted">Операция отменена</span>}
        </>
      )}
    >
      {row && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <KindTag kind={kind} />
            <Badge color={STATUS[row.status].color}>{STATUS[row.status].label}</Badge>
          </div>
          <div className="small muted" style={{ letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 }}>Сумма</div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px', color: amountColor(kind) }}>
            {k.sign}{fmt(row.amount)}
          </div>
          <div style={{ fontWeight: 500, marginTop: 4 }}>{row.desc}</div>

          <div className="divider" />
          <div className="section-title">{kind === 'accrual' ? 'Бух. проводка' : 'Движение денег'}</div>
          <FlowRow label="Источник" entity={row.source} />
          <div style={{ paddingLeft: 17, color: 'var(--muted, #6B7280)' }}>↓</div>
          <FlowRow label="Получатель" entity={row.recipient} />

          <div className="divider" />
          <div className="section-title">Детали</div>
          <KV items={[
            ['Дата', row.dt],
            ['Способ оплаты', row.method && row.method !== '—' ? row.method : 'Нет'],
            ['Комментарий', row.comment?.trim() ? row.comment : 'Нет'],
            ...(row.ref ? [['Связано с', row.ref]] : []),
          ]} />
          {row.isSystem && (
            <div className="note small" style={{ marginTop: 12 }}>
              Создано автоматически (продажа с POS).
            </div>
          )}
        </>
      )}
    </Drawer>
  )
}

function FlowRow({ label, entity }) {
  const Ico = entityIcon(entity.type)
  return (
    <div className="list-line" style={{ gap: 10 }}>
      <span
        className="icon-btn"
        style={{ width: 34, height: 34, cursor: 'default', flex: '0 0 auto' }}
      >
        <Ico size={16} />
      </span>
      <div>
        <div className="small muted">{label}</div>
        <div style={{ fontWeight: 500 }}>{entity.name}</div>
      </div>
    </div>
  )
}

// ─── Создание / редактирование операции ────────────────────────────────────────

function defaultSides(kind) {
  const [st, dt] = KIND_SIDES[kind]
  const src = entitiesForType(st)
  const dst = entitiesForType(dt)
  let recipientId = dst[0].id
  if (st === dt && dst.length > 1 && dst[0].id === src[0].id) recipientId = dst[1].id
  return { sourceId: src[0].id, recipientId }
}

function CreateOpDrawer({ open, editRow, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ kind: 'out', ...defaultSides('out'), amount: '', desc: '', method: 'Наличные', date: '', comment: '' }))

  useEffect(() => {
    if (!open) return
    if (editRow) {
      const kind = txKind(editRow.source.type, editRow.recipient.type)
      setForm({
        kind,
        sourceId: editRow.source.id,
        recipientId: editRow.recipient.id,
        amount: String(editRow.amount),
        desc: editRow.desc,
        method: editRow.method && editRow.method !== '—' ? editRow.method : 'Наличные',
        date: '',
        comment: editRow.comment || '',
      })
    } else {
      setForm({ kind: 'out', ...defaultSides('out'), amount: '', desc: '', method: 'Наличные', date: '', comment: '' })
    }
  }, [open, editRow])

  function changeKind(kind) {
    setForm((f) => ({ ...f, kind, ...defaultSides(kind) }))
  }

  const [srcType, dstType] = KIND_SIDES[form.kind]
  const sameType = srcType === dstType
  const collision = sameType && form.sourceId === form.recipientId
  const canSave = Number(form.amount) > 0 && form.sourceId && form.recipientId && !collision

  function submit(status) {
    if (!canSave) return
    const src = entityById(form.sourceId)
    const dst = entityById(form.recipientId)
    const row = {
      id: editRow ? editRow.id : Date.now(),
      dt: buildDt(form.date, editRow ? editRow.dt : todayDt()),
      source: { type: src.type, id: src.id, name: src.name },
      recipient: { type: dst.type, id: dst.id, name: dst.name },
      amount: Math.abs(Number(form.amount)),
      status,
      method: form.method,
      desc: form.desc.trim() || KIND[form.kind].label,
      comment: form.comment.trim(),
      isSystem: editRow ? editRow.isSystem : false,
      ref: editRow ? editRow.ref : undefined,
    }
    onSave(row, !!editRow)
  }

  const srcOptions = entitiesForType(srcType).map((e) => ({ value: e.id, label: e.name }))
  const dstOptions = entitiesForType(dstType).map((e) => ({ value: e.id, label: e.name }))

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={editRow ? 'Редактирование операции' : 'Новая операция'}
      footer={
        <>
          <Button disabled={!canSave} onClick={() => submit('published')}>Провести</Button>
          <Button variant="secondary" disabled={!canSave} onClick={() => submit('draft')}>Сохранить черновик</Button>
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
        </>
      }
    >
      <Field label="Вид операции">
        <Chips
          items={['Приход', 'Расход', 'Перевод', 'Начисление']}
          active={KIND[form.kind].label}
          onChange={(label) => changeKind(KIND_BY_LABEL[label])}
        />
      </Field>

      <Field label="Сумма">
        <Input
          type="number"
          placeholder="0"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </Field>

      <Field label={`Источник (${ENTITY_LABEL[srcType]})`}>
        <Select
          options={srcOptions}
          value={form.sourceId}
          onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
        />
      </Field>

      <Field label={`Получатель (${ENTITY_LABEL[dstType]})`}>
        <Select
          options={dstOptions}
          value={form.recipientId}
          onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
        />
      </Field>
      {collision && (
        <div className="note small" style={{ color: 'var(--red, #DC2626)' }}>
          Источник и получатель не могут совпадать.
        </div>
      )}

      <Field label="Назначение">
        <Input
          placeholder="Напр., закупка расходников"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />
      </Field>

      <Field label="Способ оплаты">
        <Select
          options={PAY_METHODS}
          value={form.method}
          onChange={(e) => setForm({ ...form, method: e.target.value })}
        />
      </Field>

      <Field label="Дата">
        <DatePicker value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
      </Field>

      <Field label="Комментарий">
        <Textarea
          placeholder="Примечание…"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </Field>
    </Drawer>
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
