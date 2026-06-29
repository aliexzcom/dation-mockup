import { useState } from 'react'
import { PageHead, Button, Card, Stat, Tabs, Badge, Table, Field, Input, Textarea, Select, Checkbox, Chips, Drawer } from '../components/ui.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { IcPlus, IcExport, IcEdit, IcTrash } from '../components/icons.jsx'

// ——— Мок-данные ————————————————————————————————————————————————————————

const INITIAL_GOODS = [
  { id: 1,  name: 'Шампунь профессиональный Kerastase',  type: 'professional', unit: 'шт',  buyPrice: 1800, sellPrice: 3200, stock: 12, minStock: 5,  supplier: 'КосмоПро' },
  { id: 2,  name: 'Краска для волос Wella 8/1',          type: 'professional', unit: 'шт',  buyPrice:  620, sellPrice: 1100, stock:  3, minStock: 10, supplier: 'Вэлла Рус' },
  { id: 3,  name: 'Перчатки латексные (пара)',           type: 'consumable',   unit: 'пара', buyPrice:  18, sellPrice:   35, stock: 240, minStock: 50, supplier: 'МедСнаб' },
  { id: 4,  name: 'Полотенце одноразовое',               type: 'consumable',   unit: 'уп',  buyPrice: 380, sellPrice:    0, stock:  8, minStock: 15, supplier: 'ТекстильОпт' },
  { id: 5,  name: 'Лак для ногтей OPI Red',              type: 'sale',         unit: 'шт',  buyPrice: 450, sellPrice: 890, stock: 22, minStock: 5,  supplier: 'БьютиТрейд' },
  { id: 6,  name: 'Гель для укладки Redken',             type: 'sale',         unit: 'шт',  buyPrice: 680, sellPrice: 1200, stock:  6, minStock: 8,  supplier: 'КосмоПро' },
  { id: 7,  name: 'Кератин BT Gold 100 мл',             type: 'professional', unit: 'шт',  buyPrice: 2100, sellPrice: 4200, stock:  2, minStock: 4, supplier: 'АминоПро' },
  { id: 8,  name: 'Стерильные салфетки',                type: 'consumable',   unit: 'уп',  buyPrice: 140, sellPrice:    0, stock: 30, minStock: 20, supplier: 'МедСнаб' },
]

const TYPE_LABELS = {
  sale:         { label: 'Для продажи',     color: 'blue'  },
  consumable:   { label: 'Расходник',       color: 'amber' },
  professional: { label: 'Профессиональный', color: ''     },
}

const TYPE_BY_LABEL = {
  'Для продажи':      'sale',
  'Расходник':        'consumable',
  'Профессиональный': 'professional',
}

const INITIAL_RECEIPTS = [
  { id: 'ПРХ-001', date: '2026-06-20', supplier: 'КосмоПро',    invoice: 'ТН-2345', items: 4, total: '28 400 р.', status: 'Проведён' },
  { id: 'ПРХ-002', date: '2026-06-15', supplier: 'Вэлла Рус',   invoice: 'ТН-1122', items: 2, total: '14 760 р.', status: 'Проведён' },
  { id: 'ПРХ-003', date: '2026-06-10', supplier: 'МедСнаб',     invoice: 'ТН-0987', items: 3, total:  '4 320 р.', status: 'Проведён' },
  { id: 'ПРХ-004', date: '2026-06-24', supplier: 'БьютиТрейд',  invoice: 'ТН-2500', items: 5, total: '42 000 р.', status: 'Черновик' },
]

const INITIAL_WRITEOFFS = [
  { id: 'СП-001', date: '2026-06-24', type: 'Автосписание',  reason: 'Маникюр + покрытие × 3', items: 2, total: '126 р.', who: 'Система' },
  { id: 'СП-002', date: '2026-06-23', type: 'Ручное',        reason: 'Повреждение при хранении', items: 1, total: '680 р.', who: 'Иванов А.' },
  { id: 'СП-003', date: '2026-06-22', type: 'Автосписание',  reason: 'Окрашивание × 2', items: 3, total: '1 240 р.', who: 'Система' },
  { id: 'СП-004', date: '2026-06-21', type: 'Ручное',        reason: 'Истёк срок годности', items: 4, total: '2 100 р.', who: 'Котова С.' },
]

const INITIAL_TRANSFERS = [
  { id: 'ПРМ-001', date: '2026-06-22', from: 'Центральный', to: 'Северный', items: 3, status: 'Завершено' },
  { id: 'ПРМ-002', date: '2026-06-20', from: 'Центральный', to: 'Южный',   items: 1, status: 'В пути'   },
  { id: 'ПРМ-003', date: '2026-06-18', from: 'Южный',       to: 'Центральный', items: 2, status: 'Завершено' },
]

const INITIAL_INVENTORIES = [
  { id: 'ИНВ-001', date: '2026-05-31', items: 28, diff: '-3 шт / -2 400 р.', status: 'Завершена' },
  { id: 'ИНВ-002', date: '2026-04-30', items: 24, diff: '0',                 status: 'Завершена' },
  { id: 'ИНВ-003', date: '2026-06-24', items: 0,  diff: '—',                 status: 'Открыта'  },
]

// ——— Главная страница ———————————————————————————————————————————————————

export default function Inventory() {
  const [tab, setTab] = useState('Товары')

  const TABS = ['Товары', 'Приход', 'Расход/Списание', 'Перемещение', 'Инвентаризация']

  return (
    <>
      <PageHead
        crumbs="Склад"
        title="Склад"
        sub="Управление товарами, расходниками и материалами: приход, списание, перемещение, инвентаризация."
      />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'Товары'            && <GoodsTab />}
      {tab === 'Приход'            && <ReceiptsTab />}
      {tab === 'Расход/Списание'   && <WriteoffTab />}
      {tab === 'Перемещение'       && <TransferTab />}
      {tab === 'Инвентаризация'    && <InventoryTab />}
    </>
  )
}

// ——— 10.1 Вкладка «Товары» —————————————————————————————————————————————

const EMPTY_GOOD = {
  name: '', unit: 'шт', buyPrice: '', sellPrice: '',
  stock: '0', minStock: '0', supplier: 'КосмоПро', typeLabel: 'Расходник',
}

function GoodsTab() {
  const [goods, setGoods]     = useState(INITIAL_GOODS)
  const [drawer, setDrawer]   = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch]   = useState('')
  const [typeFilter, setTypeFilter] = useState('Все типы')

  const totalSum = goods.reduce((s, g) => s + g.buyPrice * g.stock, 0)
  const belowMin = goods.filter(g => g.stock < g.minStock).length

  const filtered = goods.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'Все типы' || TYPE_LABELS[g.type].label === typeFilter
    return matchSearch && matchType
  })

  function openEdit(item) {
    setEditItem(item)
    setDrawer(true)
  }

  function openNew() {
    setEditItem(null)
    setDrawer(true)
  }

  function handleSave(form) {
    const entry = {
      id:        Date.now(),
      name:      form.name.trim(),
      type:      TYPE_BY_LABEL[form.typeLabel] || 'consumable',
      unit:      form.unit,
      buyPrice:  Number(form.buyPrice)  || 0,
      sellPrice: Number(form.sellPrice) || 0,
      stock:     Number(form.stock)     || 0,
      minStock:  Number(form.minStock)  || 0,
      supplier:  form.supplier,
    }
    setGoods([entry, ...goods])
    setDrawer(false)
  }

  return (
    <div className="grid">
      {/* Stat-карточки */}
      <div className="grid grid-3">
        <Stat label="Всего товаров" value={goods.length} />
        <Stat label="Ниже минимума" value={belowMin} delta={`${belowMin} позиции`} dir="down" />
        <Stat label="Сумма остатков (закупочная)" value={totalSum.toLocaleString('ru-RU') + ' р.'} />
      </div>

      {/* Фильтры и кнопки */}
      <div className="toolbar">
        <Input
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
        <Chips
          items={['Все типы', 'Для продажи', 'Расходник', 'Профессиональный']}
          active={typeFilter}
          onChange={setTypeFilter}
        />
        <div className="spacer" />
        <Button variant="ghost" size="sm"><IcExport size={16} /> Импорт</Button>
        <Button onClick={openNew}><IcPlus size={16} /> Товар</Button>
      </div>

      {/* Таблица */}
      <Card pad={false}>
        <Table
          columns={[
            { label: 'Название' },
            { label: 'Тип' },
            { label: 'Ед.' },
            { label: 'Закупочная', num: true },
            { label: 'Розничная', num: true },
            { label: 'Остаток', num: true },
            { label: 'Мин. остаток', num: true },
            { label: 'Поставщик' },
            { label: '' },
          ]}
          rows={filtered}
          renderRow={(g, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{g.name}</td>
              <td>
                <Badge color={TYPE_LABELS[g.type].color}>
                  {TYPE_LABELS[g.type].label}
                </Badge>
              </td>
              <td className="muted">{g.unit}</td>
              <td className="num">{g.buyPrice.toLocaleString('ru-RU')} р.</td>
              <td className="num">{g.sellPrice ? g.sellPrice.toLocaleString('ru-RU') + ' р.' : <span className="faint">—</span>}</td>
              <td className="num">
                {g.stock < g.minStock
                  ? <Badge color="red">{g.stock}</Badge>
                  : <strong>{g.stock}</strong>}
              </td>
              <td className="num muted">{g.minStock}</td>
              <td className="small muted">{g.supplier}</td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(g)}><IcEdit size={14} /></Button>
                  <Button size="sm" variant="ghost"><IcTrash size={14} /></Button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      <GoodsDrawer
        open={drawer}
        item={editItem}
        onClose={() => setDrawer(false)}
        onSave={handleSave}
      />
    </div>
  )
}

function GoodsDrawer({ open, item, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_GOOD)

  // Сбрасываем форму при открытии drawer
  useState(() => {
    if (open) {
      if (item) {
        setForm({
          name:      item.name,
          unit:      item.unit,
          buyPrice:  item.buyPrice,
          sellPrice: item.sellPrice,
          stock:     item.stock,
          minStock:  item.minStock,
          supplier:  item.supplier,
          typeLabel: TYPE_LABELS[item.type].label,
        })
      } else {
        setForm(EMPTY_GOOD)
      }
    }
  })

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleSave() {
    if (!form.name.trim()) return
    onSave(form)
    setForm(EMPTY_GOOD)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={item ? 'Редактировать товар' : 'Новый товар'}
      footer={
        <>
          <Button onClick={handleSave}>Сохранить</Button>
          {item && <Button variant="danger">Удалить</Button>}
        </>
      }
    >
      <Field label="Название товара">
        <Input
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Введите название"
        />
      </Field>
      <Field label="Единица измерения">
        <Select
          options={['шт', 'мл', 'г', 'уп', 'пара', 'л', 'кг']}
          value={form.unit}
          onChange={e => set('unit', e.target.value)}
        />
      </Field>
      <div className="grid grid-2">
        <Field label="Закупочная цена, р.">
          <Input
            type="number"
            value={form.buyPrice}
            onChange={e => set('buyPrice', e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Розничная цена, р.">
          <Input
            type="number"
            value={form.sellPrice}
            onChange={e => set('sellPrice', e.target.value)}
            placeholder="0"
          />
        </Field>
      </div>
      <div className="grid grid-2">
        <Field label="Текущий остаток">
          <Input
            type="number"
            value={form.stock}
            onChange={e => set('stock', e.target.value)}
          />
        </Field>
        <Field label="Минимальный остаток">
          <Input
            type="number"
            value={form.minStock}
            onChange={e => set('minStock', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Поставщик">
        <Select
          options={['КосмоПро', 'Вэлла Рус', 'МедСнаб', 'БьютиТрейд', 'ТекстильОпт', 'АминоПро']}
          value={form.supplier}
          onChange={e => set('supplier', e.target.value)}
        />
      </Field>
      <Field label="Тип товара">
        <Chips
          items={['Для продажи', 'Расходник', 'Профессиональный']}
          active={form.typeLabel}
          onChange={val => set('typeLabel', val)}
        />
      </Field>
      <div className="divider" />
      <div className="note small">
        Автосписание по техкартам происходит при закрытии визита. Настройте техкарту услуги в разделе «Услуги».
      </div>
    </Drawer>
  )
}

// ——— 10.2 Вкладка «Приход» —————————————————————————————————————————————

const EMPTY_RECEIPT = {
  supplier: 'КосмоПро',
  date:     '2026-06-24',
  invoice:  '',
}

function ReceiptsTab() {
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS)
  const [drawer, setDrawer]     = useState(false)
  const [form, setForm]         = useState(EMPTY_RECEIPT)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleProvide() {
    const nextNum = String(receipts.length + 1).padStart(3, '0')
    const entry = {
      id:       `ПРХ-${nextNum}`,
      date:     form.date,
      supplier: form.supplier,
      invoice:  form.invoice.trim() || '—',
      items:    1,
      total:    '0 р.',
      status:   'Проведён',
    }
    setReceipts([entry, ...receipts])
    setForm(EMPTY_RECEIPT)
    setDrawer(false)
  }

  function handleDraft() {
    const nextNum = String(receipts.length + 1).padStart(3, '0')
    const entry = {
      id:       `ПРХ-${nextNum}`,
      date:     form.date,
      supplier: form.supplier,
      invoice:  form.invoice.trim() || '—',
      items:    0,
      total:    '0 р.',
      status:   'Черновик',
    }
    setReceipts([entry, ...receipts])
    setForm(EMPTY_RECEIPT)
    setDrawer(false)
  }

  return (
    <div className="grid">
      <div className="toolbar">
        <div className="spacer" />
        <Button variant="ghost" size="sm"><IcExport size={16} /> Экспорт</Button>
        <Button onClick={() => setDrawer(true)}><IcPlus size={16} /> Приход</Button>
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Номер' },
            { label: 'Дата' },
            { label: 'Поставщик' },
            { label: 'Накладная' },
            { label: 'Позиций', num: true },
            { label: 'Сумма', num: true },
            { label: 'Статус' },
            { label: '' },
          ]}
          rows={receipts}
          renderRow={(r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{r.id}</td>
              <td className="muted">{r.date}</td>
              <td>{r.supplier}</td>
              <td className="small muted">{r.invoice}</td>
              <td className="num">{r.items}</td>
              <td className="num" style={{ fontWeight: 600 }}>{r.total}</td>
              <td>
                <Badge color={r.status === 'Проведён' ? 'green' : 'amber'}>{r.status}</Badge>
              </td>
              <td>
                <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Новый приход товара"
        footer={
          <>
            <Button variant="secondary" onClick={handleDraft}>Сохранить черновик</Button>
            <Button onClick={handleProvide}>Провести</Button>
          </>
        }
      >
        <Field label="Поставщик">
          <Select
            options={['КосмоПро', 'Вэлла Рус', 'МедСнаб', 'БьютиТрейд', 'ТекстильОпт', 'АминоПро']}
            value={form.supplier}
            onChange={e => set('supplier', e.target.value)}
          />
        </Field>
        <div className="grid grid-2">
          <Field label="Дата прихода">
            <DatePicker value={form.date} onChange={(v) => set('date', v)} />
          </Field>
          <Field label="Номер накладной">
            <Input
              placeholder="ТН-..."
              value={form.invoice}
              onChange={e => set('invoice', e.target.value)}
            />
          </Field>
        </div>
        <Field label="Склад-получатель">
          <Select options={['Центральный', 'Северный', 'Южный']} />
        </Field>
        <div className="section-title">Позиции накладной</div>
        {[1, 2].map(n => (
          <div key={n} className="grid grid-2" style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
            <Field label="Товар"><Select options={INITIAL_GOODS.map(g => g.name)} /></Field>
            <Field label="Кол-во"><Input type="number" placeholder="0" /></Field>
            <Field label="Цена закупки, р."><Input type="number" placeholder="0" /></Field>
            <Field label="Сумма, р."><Input type="number" placeholder="0" /></Field>
          </div>
        ))}
        <Button variant="secondary" style={{ marginTop: 4 }}><IcPlus size={14} /> Добавить позицию</Button>
        <div className="divider" />
        <Field label="Комментарий"><Textarea rows={2} placeholder="Примечание к приходу" /></Field>
        <div className="note small">
          Возврат поставщику оформляется как отдельная операция через кнопку «Возврат» в карточке прихода.
        </div>
      </Drawer>
    </div>
  )
}

// ——— 10.3 Вкладка «Расход/Списание» ————————————————————————————————————

const EMPTY_WRITEOFF = {
  type:   'Ручное',
  reason: 'Брак / порча',
  date:   '2026-06-24',
  warehouse: 'Центральный',
}

function WriteoffTab() {
  const [writeoffs, setWriteoffs] = useState(INITIAL_WRITEOFFS)
  const [drawer, setDrawer]       = useState(false)
  const [form, setForm]           = useState(EMPTY_WRITEOFF)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleProvide() {
    const nextNum = String(writeoffs.length + 1).padStart(3, '0')
    const entry = {
      id:     `СП-${nextNum}`,
      date:   form.date,
      type:   form.type,
      reason: form.reason,
      items:  1,
      total:  '0 р.',
      who:    'Вручную',
    }
    setWriteoffs([entry, ...writeoffs])
    setForm(EMPTY_WRITEOFF)
    setDrawer(false)
  }

  return (
    <div className="grid">
      <div className="toolbar">
        <Chips
          items={['Все', 'Автосписание', 'Ручное']}
          active="Все"
          onChange={() => {}}
        />
        <div className="spacer" />
        <Button onClick={() => setDrawer(true)}><IcPlus size={16} /> Списание</Button>
      </div>

      <div className="note small">
        Автосписание происходит по техкартам после закрытия визита. Ручное списание — для брака, порчи и прочих нужд.
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Номер' },
            { label: 'Дата' },
            { label: 'Тип' },
            { label: 'Основание' },
            { label: 'Позиций', num: true },
            { label: 'Сумма', num: true },
            { label: 'Кем' },
            { label: '' },
          ]}
          rows={writeoffs}
          renderRow={(r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{r.id}</td>
              <td className="muted">{r.date}</td>
              <td>
                <Badge color={r.type === 'Автосписание' ? 'blue' : 'amber'}>{r.type}</Badge>
              </td>
              <td>{r.reason}</td>
              <td className="num">{r.items}</td>
              <td className="num" style={{ fontWeight: 600 }}>{r.total}</td>
              <td className="small muted">{r.who}</td>
              <td>
                <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Новое списание"
        footer={<><Button onClick={handleProvide}>Провести списание</Button></>}
      >
        <Field label="Тип списания">
          <Chips
            items={['Ручное', 'По акту']}
            active={form.type}
            onChange={val => set('type', val)}
          />
        </Field>
        <Field label="Причина">
          <Select
            options={['Брак / порча', 'Истёк срок годности', 'Недостача', 'Служебное использование', 'Иное']}
            value={form.reason}
            onChange={e => set('reason', e.target.value)}
          />
        </Field>
        <div className="grid grid-2">
          <Field label="Дата">
            <DatePicker value={form.date} onChange={(v) => set('date', v)} />
          </Field>
          <Field label="Склад">
            <Select
              options={['Центральный', 'Северный', 'Южный']}
              value={form.warehouse}
              onChange={e => set('warehouse', e.target.value)}
            />
          </Field>
        </div>
        <div className="section-title">Позиции</div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
          <div className="grid grid-2">
            <Field label="Товар"><Select options={INITIAL_GOODS.map(g => g.name)} /></Field>
            <Field label="Количество"><Input type="number" placeholder="0" /></Field>
          </div>
        </div>
        <Button variant="secondary" style={{ marginTop: 4 }}><IcPlus size={14} /> Добавить позицию</Button>
        <div className="divider" />
        <Field label="Комментарий"><Textarea rows={2} placeholder="Примечание" /></Field>
      </Drawer>
    </div>
  )
}

// ——— 10.4 Вкладка «Перемещение» ————————————————————————————————————————

const EMPTY_TRANSFER = {
  from: 'Центральный',
  to:   'Северный',
  date: '2026-06-24',
}

function TransferTab() {
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS)
  const [drawer, setDrawer]       = useState(false)
  const [form, setForm]           = useState(EMPTY_TRANSFER)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleCreate() {
    const nextNum = String(transfers.length + 1).padStart(3, '0')
    const entry = {
      id:     `ПРМ-${nextNum}`,
      date:   form.date,
      from:   form.from,
      to:     form.to,
      items:  1,
      status: 'В пути',
    }
    setTransfers([entry, ...transfers])
    setForm(EMPTY_TRANSFER)
    setDrawer(false)
  }

  return (
    <div className="grid">
      <div className="toolbar">
        <div className="spacer" />
        <Button onClick={() => setDrawer(true)}><IcPlus size={16} /> Перемещение</Button>
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Номер' },
            { label: 'Дата' },
            { label: 'Откуда' },
            { label: 'Куда' },
            { label: 'Позиций', num: true },
            { label: 'Статус' },
            { label: '' },
          ]}
          rows={transfers}
          renderRow={(r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{r.id}</td>
              <td className="muted">{r.date}</td>
              <td>{r.from}</td>
              <td>{r.to}</td>
              <td className="num">{r.items}</td>
              <td>
                <Badge color={r.status === 'Завершено' ? 'green' : 'blue'}>{r.status}</Badge>
              </td>
              <td>
                <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Новое перемещение"
        footer={<><Button onClick={handleCreate}>Создать перемещение</Button></>}
      >
        <div className="grid grid-2">
          <Field label="Склад-источник">
            <Select
              options={['Центральный', 'Северный', 'Южный']}
              value={form.from}
              onChange={e => set('from', e.target.value)}
            />
          </Field>
          <Field label="Склад-получатель">
            <Select
              options={['Северный', 'Центральный', 'Южный']}
              value={form.to}
              onChange={e => set('to', e.target.value)}
            />
          </Field>
          <Field label="Дата перемещения">
            <DatePicker value={form.date} onChange={(v) => set('date', v)} />
          </Field>
        </div>
        <div className="section-title">Позиции</div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
          <div className="grid grid-2">
            <Field label="Товар"><Select options={INITIAL_GOODS.map(g => g.name)} /></Field>
            <Field label="Количество"><Input type="number" placeholder="0" /></Field>
          </div>
        </div>
        <Button variant="secondary"><IcPlus size={14} /> Добавить позицию</Button>
        <div className="divider" />
        <Field label="Комментарий"><Textarea rows={2} placeholder="Примечание к перемещению" /></Field>
      </Drawer>
    </div>
  )
}

// ——— 10.5 Вкладка «Инвентаризация» ————————————————————————————————————

const EMPTY_INVENTORY = {
  warehouse:   'Центральный',
  date:        '2026-06-24',
  responsible: 'Анна Морозова',
}

function InventoryTab() {
  const [inventories, setInventories] = useState(INITIAL_INVENTORIES)
  const [drawer, setDrawer]           = useState(false)
  const [form, setForm]               = useState(EMPTY_INVENTORY)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleStart() {
    const nextNum = String(inventories.length + 1).padStart(3, '0')
    const entry = {
      id:     `ИНВ-${nextNum}`,
      date:   form.date,
      items:  0,
      diff:   '—',
      status: 'Черновик',
    }
    setInventories([entry, ...inventories])
    setForm(EMPTY_INVENTORY)
    setDrawer(false)
  }

  function handleDraft() {
    const nextNum = String(inventories.length + 1).padStart(3, '0')
    const entry = {
      id:     `ИНВ-${nextNum}`,
      date:   form.date,
      items:  0,
      diff:   '—',
      status: 'Черновик',
    }
    setInventories([entry, ...inventories])
    setForm(EMPTY_INVENTORY)
    setDrawer(false)
  }

  return (
    <div className="grid">
      <div className="toolbar">
        <div className="spacer" />
        <Button onClick={() => setDrawer(true)}><IcPlus size={16} /> Инвентаризация</Button>
      </div>

      <div className="note small">
        Инвентаризация — сверка фактического остатка с учётным. По результату формируется акт и вносятся корректировки.
      </div>

      <Card pad={false}>
        <Table
          columns={[
            { label: 'Номер' },
            { label: 'Дата' },
            { label: 'Позиций', num: true },
            { label: 'Отклонение' },
            { label: 'Статус' },
            { label: '' },
          ]}
          rows={inventories}
          renderRow={(r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{r.id}</td>
              <td className="muted">{r.date}</td>
              <td className="num">{r.items || <span className="faint">—</span>}</td>
              <td className={r.diff.startsWith('-') ? 'red' : ''}>{r.diff}</td>
              <td>
                <Badge color={r.status === 'Завершена' ? 'green' : r.status === 'Открыта' ? 'blue' : 'gray'}>
                  {r.status}
                </Badge>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button size="sm" variant="ghost"><IcEdit size={14} /></Button>
                  {r.status === 'Завершена' && (
                    <Button size="sm" variant="ghost"><IcExport size={14} /></Button>
                  )}
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Новая инвентаризация"
        footer={
          <>
            <Button variant="secondary" onClick={handleDraft}>Сохранить черновик</Button>
            <Button onClick={handleStart}>Начать подсчёт</Button>
          </>
        }
      >
        <div className="grid grid-2">
          <Field label="Склад">
            <Select
              options={['Центральный', 'Северный', 'Южный', 'Все склады']}
              value={form.warehouse}
              onChange={e => set('warehouse', e.target.value)}
            />
          </Field>
          <Field label="Дата проведения">
            <DatePicker value={form.date} onChange={(v) => set('date', v)} />
          </Field>
        </div>
        <Field label="Ответственный">
          <Select
            options={['Анна Морозова', 'Светлана Котова', 'Дмитрий Орлов', 'Игорь Лебедев']}
            value={form.responsible}
            onChange={e => set('responsible', e.target.value)}
          />
        </Field>
        <Checkbox label="Включить все товары в опись" checked={true} onChange={() => {}} />
        <div className="note small" style={{ marginTop: 10 }}>
          После создания инвентаризации станет доступна таблица для ввода фактических остатков. Система автоматически рассчитает отклонения и сформирует акт.
        </div>
        <div className="note small">
          Возврат поставщику — оформляется через «Расход/Списание» или из карточки прихода кнопкой «Возврат поставщику».
        </div>
      </Drawer>
    </div>
  )
}

