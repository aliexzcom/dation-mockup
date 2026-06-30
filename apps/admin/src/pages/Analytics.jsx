import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHead, Button, Card, Stat, Badge, Table, Select, SearchInput } from '../components/ui.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { IcExport } from '../components/icons.jsx'

const parseAmt = (s) => Number(String(s).replace(/[^\d]/g, '')) || 0
const fmtMoney = (n) => n.toLocaleString('ru-RU') + ' ₽'

const BRANCHES = ['Все филиалы', 'Центральный', 'Северный', 'Южный']

const REVENUE_BARS = [
  { label: 'Пн', cur: 68, prev: 52 }, { label: 'Вт', cur: 82, prev: 74 },
  { label: 'Ср', cur: 75, prev: 61 }, { label: 'Чт', cur: 91, prev: 80 },
  { label: 'Пт', cur: 110, prev: 95 }, { label: 'Сб', cur: 130, prev: 112 },
  { label: 'Вс', cur: 55, prev: 48 },
]

const STAFF_LOAD = [
  { name: 'Анна Морозова', load: 88, prev: 82 },
  { name: 'Игорь Лебедев', load: 74, prev: 70 },
  { name: 'Светлана Котова', load: 91, prev: 85 },
  { name: 'Дмитрий Орлов', load: 62, prev: 68 },
  { name: 'Наталья Пак', load: 79, prev: 75 },
]

// Детализация отчёта «По дням»: услуга, сотрудник, сумма, дата, способ оплаты
const DAILY_ROWS = [
  { date: '24.06.2026', service: 'Женская стрижка + укладка', staff: 'Анна Морозова', amount: '2 800 ₽', pay: 'Карта' },
  { date: '24.06.2026', service: 'Маникюр + гель-лак', staff: 'Светлана Котова', amount: '2 200 ₽', pay: 'Наличные' },
  { date: '24.06.2026', service: 'Мужская стрижка', staff: 'Игорь Лебедев', amount: '1 500 ₽', pay: 'Онлайн (Mini App)' },
  { date: '23.06.2026', service: 'Окрашивание в один тон', staff: 'Анна Морозова', amount: '6 500 ₽', pay: 'Карта' },
  { date: '23.06.2026', service: 'Чистка лица аппаратная', staff: 'Дмитрий Орлов', amount: '3 500 ₽', pay: 'Карта' },
  { date: '23.06.2026', service: 'Стрижка бороды', staff: 'Игорь Лебедев', amount: '800 ₽', pay: 'Наличные' },
  { date: '22.06.2026', service: 'Балаяж / Омбре', staff: 'Анна Морозова', amount: '9 000 ₽', pay: 'Смешанная' },
  { date: '22.06.2026', service: 'Педикюр классический', staff: 'Светлана Котова', amount: '2 500 ₽', pay: 'Карта' },
]

// ── Бар-чарт (псевдо) ──
function BarChart({ bars, maxVal, color = '#7C3AED', prevColor = '#DDD6FE', showPrev = true, valueLabel = '' }) {
  const max = maxVal || Math.max(...bars.map(b => Math.max(b.cur, b.prev || 0)))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, paddingTop: 8 }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 96, width: '100%', justifyContent: 'center' }}>
            {showPrev && b.prev != null && (
              <div style={{ width: '38%', height: `${Math.round((b.prev / max) * 96)}px`, background: prevColor, borderRadius: '3px 3px 0 0' }} title={`Прошлый период: ${b.prev}${valueLabel}`} />
            )}
            <div style={{ width: showPrev ? '38%' : '60%', height: `${Math.round((b.cur / max) * 96)}px`, background: color, borderRadius: '3px 3px 0 0' }} title={`Текущий: ${b.cur}${valueLabel}`} />
          </div>
          <div className="muted small" style={{ fontSize: 11 }}>{b.label}</div>
        </div>
      ))}
    </div>
  )
}

function HBar({ name, load, prev }) {
  const delta = load - prev
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13 }}>{name}</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {load}%<span style={{ fontSize: 11, color: delta >= 0 ? '#16A34A' : '#EF4444', marginLeft: 6 }}>{delta >= 0 ? '+' : ''}{delta}%</span>
        </span>
      </div>
      <div style={{ background: '#EDE9FE', borderRadius: 4, height: 8, position: 'relative' }}>
        <div style={{ background: '#DDD6FE', borderRadius: 4, height: 8, width: `${prev}%`, position: 'absolute' }} />
        <div style={{ background: '#7C3AED', borderRadius: 4, height: 8, width: `${load}%`, position: 'absolute' }} />
      </div>
    </div>
  )
}

// Легенда текущий/прошлый для шапки графика
const ChartLegend = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><span style={{ width: 10, height: 10, background: '#7C3AED', borderRadius: 2 }} />Текущий</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><span style={{ width: 10, height: 10, background: '#DDD6FE', borderRadius: 2 }} />Прошлый</span>
  </div>
)

// Детализация по сотрудникам: выработка, загрузка, средний чек, повторные, рейтинг
const STAFF_ROWS = [
  { name: 'Анна Морозова', role: 'Парикмахер-стилист', revenue: 562000, visits: 184, avg: 3054, load: 88, repeat: 72, rating: 4.9 },
  { name: 'Игорь Лебедев', role: 'Барбер', revenue: 318000, visits: 212, avg: 1500, load: 74, repeat: 65, rating: 4.7 },
  { name: 'Светлана Котова', role: 'Мастер маникюра', revenue: 286000, visits: 142, avg: 2014, load: 91, repeat: 78, rating: 4.8 },
  { name: 'Дмитрий Орлов', role: 'Косметолог', revenue: 240000, visits: 96, avg: 2500, load: 62, repeat: 58, rating: 4.6 },
  { name: 'Наталья Пак', role: 'Мастер маникюра', revenue: 198000, visits: 110, avg: 1800, load: 79, repeat: 61, rating: 4.7 },
]

// Детальная страница «Сотрудники» — выработка, загрузка, средний чек, повторные, рейтинг
function StaffDetail() {
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [branch, setBranch] = useState('Все филиалы')
  const [search, setSearch] = useState('')

  const rows = STAFF_ROWS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  const totalRev = rows.reduce((s, r) => s + r.revenue, 0)
  const avgLoad = rows.length ? Math.round(rows.reduce((s, r) => s + r.load, 0) / rows.length) : 0
  const avgRating = rows.length ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(1) : 0

  return (
    <>
      <PageHead
        crumbs="Аналитика и отчёты"
        title="Сотрудники"
        sub="Выработка, загрузка, средний чек, доля повторных клиентов и рейтинг — на одной таблице."
        actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>}
      />

      <div className="toolbar">
        <span className="small muted">с:</span>
        <DatePicker value={from} onChange={setFrom} style={{ width: 150 }} />
        <span className="small muted">по:</span>
        <DatePicker value={to} onChange={setTo} style={{ width: 150 }} />
        <Select value={branch} onChange={e => setBranch(e.target.value)} options={BRANCHES} style={{ width: 190 }} />
        <div className="spacer" />
        <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по сотруднику" style={{ minWidth: 220 }} />
      </div>

      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <Stat label="Сотрудников" value={rows.length} />
        <Stat label="Суммарная выручка" value={fmtMoney(totalRev)} />
        <Stat label="Средняя загрузка" value={`${avgLoad}%`} />
        <Stat label="Средний рейтинг" value={avgRating} />
      </div>

      <Card title="Сотрудники" pad={false}>
        <Table
          columns={[
            { label: 'Сотрудник' }, { label: 'Должность' },
            { label: 'Выручка', num: true }, { label: 'Визитов', num: true },
            { label: 'Средний чек', num: true }, { label: 'Загрузка', num: true },
            { label: '% повторных', num: true }, { label: 'Рейтинг', num: true },
          ]}
          rows={rows}
          renderRow={(r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{r.name}</td>
              <td className="small muted">{r.role}</td>
              <td className="num">{fmtMoney(r.revenue)}</td>
              <td className="num">{r.visits}</td>
              <td className="num">{fmtMoney(r.avg)}</td>
              <td className="num">{r.load}%</td>
              <td className="num">{r.repeat}%</td>
              <td className="num">{r.rating}</td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}

// Детальная страница «Выручка» — все срезы (по дням/услугам/сотрудникам/оплате) на одной таблице
function RevenueDetail() {
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [branch, setBranch] = useState('Все филиалы')
  const [staff, setStaff] = useState('Все сотрудники')
  const [pay, setPay] = useState('Все способы')
  const [search, setSearch] = useState('')

  const staffOpts = ['Все сотрудники', ...new Set(DAILY_ROWS.map(r => r.staff))]
  const payOpts = ['Все способы', ...new Set(DAILY_ROWS.map(r => r.pay))]

  const rows = DAILY_ROWS.filter(r =>
    (staff === 'Все сотрудники' || r.staff === staff) &&
    (pay === 'Все способы' || r.pay === pay) &&
    r.service.toLowerCase().includes(search.toLowerCase())
  )
  const total = rows.reduce((s, r) => s + parseAmt(r.amount), 0)
  const avg = rows.length ? Math.round(total / rows.length) : 0

  return (
    <>
      <PageHead
        crumbs="Аналитика и отчёты"
        title="Выручка"
        sub="Детализация выручки: дата, услуга, сотрудник, сумма и способ оплаты — с фильтрами и итогами."
        actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>}
      />

      <div className="toolbar">
        <span className="small muted">с:</span>
        <DatePicker value={from} onChange={setFrom} style={{ width: 140 }} />
        <span className="small muted">по:</span>
        <DatePicker value={to} onChange={setTo} style={{ width: 140 }} />
        <Select value={branch} onChange={e => setBranch(e.target.value)} options={BRANCHES} style={{ width: 150 }} />
        <Select value={staff} onChange={e => setStaff(e.target.value)} options={staffOpts} style={{ width: 160 }} />
        <Select value={pay} onChange={e => setPay(e.target.value)} options={payOpts} style={{ width: 150 }} />
        <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по услуге" style={{ width: 200 }} />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <Stat label="Выручка за период" value={fmtMoney(total)} />
        <Stat label="Количество операций" value={rows.length} />
        <Stat label="Средний чек" value={fmtMoney(avg)} />
      </div>

      <Card title="Операции" pad={false}>
        <Table
          columns={[{ label: 'Дата' }, { label: 'Услуга' }, { label: 'Сотрудник' }, { label: 'Сумма', num: true }, { label: 'Способ оплаты' }]}
          rows={rows}
          renderRow={(r, i) => (
            <tr key={i}>
              <td className="small muted">{r.date}</td>
              <td style={{ fontWeight: 500 }}>{r.service}</td>
              <td className="small">{r.staff}</td>
              <td className="num">{r.amount}</td>
              <td className="small">{r.pay}</td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}

// Общий тулбар фильтров «период с/по + филиал + поиск»
function FilterBar({ from, setFrom, to, setTo, branch, setBranch, search, setSearch, searchPh, children }) {
  return (
    <div className="toolbar">
      <span className="small muted">с:</span>
      <DatePicker value={from} onChange={setFrom} style={{ width: 150 }} />
      <span className="small muted">по:</span>
      <DatePicker value={to} onChange={setTo} style={{ width: 150 }} />
      <Select value={branch} onChange={e => setBranch(e.target.value)} options={BRANCHES} style={{ width: 190 }} />
      {children}
      <div className="spacer" />
      <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder={searchPh} style={{ minWidth: 220 }} />
    </div>
  )
}
function useRange() {
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [branch, setBranch] = useState('Все филиалы')
  const [search, setSearch] = useState('')
  return { from, setFrom, to, setTo, branch, setBranch, search, setSearch }
}

// ── Клиенты ──
const CLIENT_ROWS = [
  { name: 'Мария Петрова', seg: 'Чемпионы', visits: 14, ltv: 42800, last: '18.06.2026', source: 'Instagram', status: 'Активный' },
  { name: 'Артём Белов', seg: 'Чемпионы', visits: 22, ltv: 68400, last: '22.06.2026', source: 'Mini App', status: 'Активный' },
  { name: 'Ольга Кузнецова', seg: 'Новые', visits: 3, ltv: 8500, last: '20.06.2026', source: 'Рекомендация', status: 'Новый' },
  { name: 'Елена Смирнова', seg: 'Под угрозой', visits: 7, ltv: 21300, last: '02.02.2026', source: 'Реклама', status: 'Потерянный' },
  { name: 'Инна Рыжова', seg: 'Лояльные', visits: 18, ltv: 55600, last: '19.06.2026', source: 'Mini App', status: 'Активный' },
  { name: 'Светлана Новикова', seg: 'Под угрозой', visits: 9, ltv: 31000, last: '10.03.2026', source: 'Сарафан', status: 'Потерянный' },
]
function ClientsDetail() {
  const f = useRange()
  const [status, setStatus] = useState('Все статусы')
  const rows = CLIENT_ROWS.filter(r => (status === 'Все статусы' || r.status === status) && r.name.toLowerCase().includes(f.search.toLowerCase()))
  const newC = rows.filter(r => r.status === 'Новый').length
  const lost = rows.filter(r => r.status === 'Потерянный').length
  const avgLtv = rows.length ? Math.round(rows.reduce((s, r) => s + r.ltv, 0) / rows.length) : 0
  const badge = (s) => s === 'Активный' ? 'green' : s === 'Новый' ? 'blue' : 'gray'
  return (
    <>
      <PageHead crumbs="Аналитика и отчёты" title="Клиенты" sub="Движение базы, LTV, RFM-сегменты и источники привлечения — на одной таблице." actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>} />
      <FilterBar {...f} searchPh="Поиск по клиенту">
        <Select value={status} onChange={e => setStatus(e.target.value)} options={['Все статусы', 'Активный', 'Новый', 'Потерянный']} style={{ width: 160 }} />
      </FilterBar>
      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <Stat label="Клиентов" value={rows.length} />
        <Stat label="Новые" value={newC} />
        <Stat label="Потерянные" value={lost} />
        <Stat label="Средний LTV" value={fmtMoney(avgLtv)} />
      </div>
      <Card title="Клиенты" pad={false}>
        <Table
          columns={[{ label: 'Клиент' }, { label: 'RFM-сегмент' }, { label: 'Визитов', num: true }, { label: 'LTV', num: true }, { label: 'Последний визит' }, { label: 'Источник' }, { label: 'Статус' }]}
          rows={rows}
          renderRow={(r, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{r.name}</td>
              <td className="small">{r.seg}</td>
              <td className="num">{r.visits}</td>
              <td className="num">{fmtMoney(r.ltv)}</td>
              <td className="small muted">{r.last}</td>
              <td className="small">{r.source}</td>
              <td><Badge color={badge(r.status)}>{r.status}</Badge></td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}

// ── Записи ──
const BOOKING_ROWS = [
  { date: '24.06.2026', client: 'Мария П.', service: 'Стрижка + укладка', staff: 'Анна Морозова', source: 'Mini App', status: 'Завершён' },
  { date: '24.06.2026', client: 'Павел Н.', service: 'Стрижка бороды', staff: 'Игорь Лебедев', source: 'Mini App', status: 'Ожидает' },
  { date: '23.06.2026', client: 'Инна Р.', service: 'Чистка лица', staff: 'Дмитрий Орлов', source: 'Mini App', status: 'Не пришёл' },
  { date: '23.06.2026', client: 'Сергей Д.', service: 'Стрижка + борода', staff: 'Игорь Лебедев', source: 'Реклама', status: 'Завершён' },
  { date: '22.06.2026', client: 'Алёна М.', service: 'Пилинг', staff: 'Дмитрий Орлов', source: 'Mini App', status: 'Отменён' },
  { date: '22.06.2026', client: 'Ольга К.', service: 'Окрашивание', staff: 'Анна Морозова', source: 'Телефон', status: 'Завершён' },
]
function BookingsDetail() {
  const f = useRange()
  const [status, setStatus] = useState('Все статусы')
  const rows = BOOKING_ROWS.filter(r => (status === 'Все статусы' || r.status === status) && (r.client.toLowerCase().includes(f.search.toLowerCase()) || r.service.toLowerCase().includes(f.search.toLowerCase())))
  const pct = (n) => rows.length ? Math.round((n / rows.length) * 100) : 0
  const miniapp = pct(rows.filter(r => r.source === 'Mini App').length)
  const noshow = pct(rows.filter(r => r.status === 'Не пришёл').length)
  const cancels = rows.filter(r => r.status === 'Отменён').length
  const badge = (s) => s === 'Завершён' ? 'green' : s === 'Ожидает' ? 'amber' : s === 'Не пришёл' ? 'red' : 'gray'
  return (
    <>
      <PageHead crumbs="Аналитика и отчёты" title="Записи" sub="Воронка и конверсия записи, источники, отмены и неявки — на одной таблице." actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>} />
      <FilterBar {...f} searchPh="Поиск по клиенту/услуге">
        <Select value={status} onChange={e => setStatus(e.target.value)} options={['Все статусы', 'Завершён', 'Ожидает', 'Не пришёл', 'Отменён']} style={{ width: 160 }} />
      </FilterBar>
      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        <Stat label="Всего записей" value={rows.length} />
        <Stat label="Из Mini App" value={`${miniapp}%`} />
        <Stat label="No-show" value={`${noshow}%`} />
        <Stat label="Отмены" value={cancels} />
      </div>
      <Card title="Записи" pad={false}>
        <Table
          columns={[{ label: 'Дата' }, { label: 'Клиент' }, { label: 'Услуга' }, { label: 'Сотрудник' }, { label: 'Источник' }, { label: 'Статус' }]}
          rows={rows}
          renderRow={(r, i) => (
            <tr key={i}>
              <td className="small muted">{r.date}</td>
              <td style={{ fontWeight: 500 }}>{r.client}</td>
              <td className="small">{r.service}</td>
              <td className="small">{r.staff}</td>
              <td className="small">{r.source}</td>
              <td><Badge color={badge(r.status)}>{r.status}</Badge></td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}

// ── Услуги ──
const SERVICE_ROWS = [
  { name: 'Женская стрижка', cat: 'Стрижки', count: 184, revenue: 515200, cost: 42000 },
  { name: 'Окрашивание в один тон', cat: 'Окрашивание', count: 62, revenue: 403000, cost: 96000 },
  { name: 'Маникюр + гель-лак', cat: 'Маникюр', count: 142, revenue: 312400, cost: 38000 },
  { name: 'Мужская стрижка', cat: 'Стрижки', count: 212, revenue: 318000, cost: 18000 },
  { name: 'Чистка лица', cat: 'Косметология', count: 48, revenue: 168000, cost: 36000 },
  { name: 'Балаяж / Омбре', cat: 'Окрашивание', count: 21, revenue: 210000, cost: 62000 },
]
function ServicesDetail() {
  const f = useRange()
  const [cat, setCat] = useState('Все категории')
  const catOpts = ['Все категории', ...new Set(SERVICE_ROWS.map(r => r.cat))]
  const rows = SERVICE_ROWS.filter(r => (cat === 'Все категории' || r.cat === cat) && r.name.toLowerCase().includes(f.search.toLowerCase()))
  const totalRev = rows.reduce((s, r) => s + r.revenue, 0)
  const totalMargin = rows.reduce((s, r) => s + (r.revenue - r.cost), 0)
  const marginPct = totalRev ? Math.round((totalMargin / totalRev) * 100) : 0
  return (
    <>
      <PageHead crumbs="Аналитика и отчёты" title="Услуги" sub="Топ услуг и маржинальность: количество, выручка, себестоимость и маржа — на одной таблице." actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>} />
      <FilterBar {...f} searchPh="Поиск по услуге">
        <Select value={cat} onChange={e => setCat(e.target.value)} options={catOpts} style={{ width: 180 }} />
      </FilterBar>
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <Stat label="Услуг" value={rows.length} />
        <Stat label="Выручка" value={fmtMoney(totalRev)} />
        <Stat label="Средняя маржа" value={`${marginPct}%`} />
      </div>
      <Card title="Услуги" pad={false}>
        <Table
          columns={[{ label: 'Услуга' }, { label: 'Категория' }, { label: 'Кол-во', num: true }, { label: 'Выручка', num: true }, { label: 'Себестоимость', num: true }, { label: 'Маржа', num: true }, { label: 'Маржа %', num: true }]}
          rows={rows}
          renderRow={(r, i) => {
            const margin = r.revenue - r.cost
            const mp = Math.round((margin / r.revenue) * 100)
            return (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td className="small muted">{r.cat}</td>
                <td className="num">{r.count}</td>
                <td className="num">{fmtMoney(r.revenue)}</td>
                <td className="num">{fmtMoney(r.cost)}</td>
                <td className="num">{fmtMoney(margin)}</td>
                <td className="num">{mp}%</td>
              </tr>
            )
          }}
        />
      </Card>
    </>
  )
}

// ── Финансы ──
const FIN_ROWS = [
  { date: '24.06.2026', type: 'Доход', item: 'Услуги', pay: 'Карта', amount: 128400 },
  { date: '24.06.2026', type: 'Доход', item: 'Продажа товаров', pay: 'Наличные', amount: 18600 },
  { date: '23.06.2026', type: 'Расход', item: 'Закупка материалов', pay: 'Перевод', amount: -42000 },
  { date: '22.06.2026', type: 'Расход', item: 'Аренда', pay: 'Перевод', amount: -90000 },
  { date: '22.06.2026', type: 'Расход', item: 'Зарплата', pay: 'Перевод', amount: -310000 },
  { date: '21.06.2026', type: 'Доход', item: 'Услуги', pay: 'Онлайн (Mini App)', amount: 96500 },
]
function FinanceDetail() {
  const f = useRange()
  const [type, setType] = useState('Все типы')
  const rows = FIN_ROWS.filter(r => (type === 'Все типы' || r.type === type) && r.item.toLowerCase().includes(f.search.toLowerCase()))
  const income = rows.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0)
  const expense = rows.filter(r => r.amount < 0).reduce((s, r) => s + Math.abs(r.amount), 0)
  return (
    <>
      <PageHead crumbs="Аналитика и отчёты" title="Финансы" sub="P&L, транзакции и зарплата: доходы и расходы по статьям и способам оплаты — на одной таблице." actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>} />
      <FilterBar {...f} searchPh="Поиск по статье">
        <Select value={type} onChange={e => setType(e.target.value)} options={['Все типы', 'Доход', 'Расход']} style={{ width: 150 }} />
      </FilterBar>
      <div className="grid grid-3" style={{ marginBottom: 18 }}>
        <Stat label="Доходы" value={fmtMoney(income)} />
        <Stat label="Расходы" value={fmtMoney(expense)} />
        <Stat label="Прибыль (P&L)" value={fmtMoney(income - expense)} dir={income - expense >= 0 ? 'up' : 'down'} />
      </div>
      <Card title="Операции" pad={false}>
        <Table
          columns={[{ label: 'Дата' }, { label: 'Тип' }, { label: 'Статья' }, { label: 'Способ оплаты' }, { label: 'Сумма', num: true }]}
          rows={rows}
          renderRow={(r, i) => (
            <tr key={i}>
              <td className="small muted">{r.date}</td>
              <td><Badge color={r.amount >= 0 ? 'green' : 'red'}>{r.type}</Badge></td>
              <td style={{ fontWeight: 500 }}>{r.item}</td>
              <td className="small">{r.pay}</td>
              <td className="num" style={{ color: r.amount >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                {r.amount >= 0 ? '+' : '−'}{fmtMoney(Math.abs(r.amount))}
              </td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}

export default function Analytics() {
  const { group: groupSlug } = useParams()
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [branch, setBranch] = useState('Все филиалы')

  // ── Каждая группа отчётов — отдельная страница с детальной таблицей ──
  if (groupSlug === 'vyruchka') return <RevenueDetail />
  if (groupSlug === 'sotrudniki') return <StaffDetail />
  if (groupSlug === 'klienty') return <ClientsDetail />
  if (groupSlug === 'zapisi') return <BookingsDetail />
  if (groupSlug === 'uslugi') return <ServicesDetail />
  if (groupSlug === 'finansy') return <FinanceDetail />
  if (groupSlug) return <PageHead crumbs="Аналитика и отчёты" title="Группа не найдена" />

  // ── Дашборд ──
  return (
    <>
      <PageHead
        crumbs="Аналитика и отчёты"
        title="Дашборд"
        sub="Ключевые показатели бизнеса, динамика и сравнение по филиалам."
        actions={<Button variant="ghost"><IcExport size={16} /> Экспорт</Button>}
      />

      <div className="toolbar" style={{ marginBottom: 20 }}>
        <span className="small muted">с:</span>
        <DatePicker value={from} onChange={setFrom} style={{ width: 150 }} />
        <span className="small muted">по:</span>
        <DatePicker value={to} onChange={setTo} style={{ width: 150 }} />
        <Select options={BRANCHES} value={branch} onChange={e => setBranch(e.target.value)} style={{ width: 160 }} />
        <span className="muted small">Сравнение с предыдущим периодом</span>
        <div className="spacer" />
        <Button variant="ghost" size="sm"><IcExport size={14} /> Excel</Button>
        <Button variant="ghost" size="sm"><IcExport size={14} /> PDF</Button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <Stat label="Выручка" value="1 248 500 ₽" delta="+14%" dir="up" />
        <Stat label="Количество визитов" value="842" delta="+9%" dir="up" />
        <Stat label="Средний чек" value="1 483 ₽" delta="+5%" dir="up" />
        <Stat label="Загрузка" value="78%" delta="+3%" dir="up" />
      </div>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <Stat label="Новые клиенты" value="134" delta="+22%" dir="up" />
        <Stat label="Повторные клиенты" value="708" delta="+7%" dir="up" />
        <Stat label="No-show" value="4,8%" delta="-0,6%" dir="up" />
        <Stat label="Из Mini App" value="61%" delta="+8%" dir="up" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <Card title="Выручка по дням" actions={<ChartLegend />}>
          <BarChart bars={REVENUE_BARS} valueLabel=" тыс. ₽" />
          <div className="note" style={{ marginTop: 8, textAlign: 'center' }}>Тыс. ₽ · Текущая неделя vs прошлая</div>
        </Card>
        <Card title="Загрузка по сотрудникам" actions={<ChartLegend />}>
          <div style={{ paddingTop: 8 }}>
            {STAFF_LOAD.map((s, i) => <HBar key={i} name={s.name} load={s.load} prev={s.prev} />)}
          </div>
        </Card>
      </div>

      {branch === 'Все филиалы' && (
        <Card title="Сравнение по филиалам" pad={false}>
          <Table
            columns={[{ label: 'Филиал' }, { label: 'Выручка', num: true }, { label: 'Визиты', num: true }, { label: 'Средний чек', num: true }, { label: 'Загрузка', num: true }, { label: 'No-show', num: true }]}
            rows={[
              { name: 'Центр (ул. Ленина, 12)', rev: '562 000 ₽', visits: 381, avg: '1 475 ₽', load: '82%', noshow: '3,9%' },
              { name: 'Север (пр. Победы, 45)', rev: '418 500 ₽', visits: 289, avg: '1 448 ₽', load: '75%', noshow: '5,2%' },
              { name: 'Юг (ул. Садовая, 7)', rev: '268 000 ₽', visits: 172, avg: '1 558 ₽', load: '71%', noshow: '6,4%' },
            ]}
            renderRow={(r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td className="num">{r.rev}</td>
                <td className="num">{r.visits}</td>
                <td className="num">{r.avg}</td>
                <td className="num">{r.load}</td>
                <td className="num">{r.noshow}</td>
              </tr>
            )}
          />
        </Card>
      )}
    </>
  )
}
