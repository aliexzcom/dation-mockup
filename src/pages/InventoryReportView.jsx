import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHead, Button, Card, Table, Select, SearchInput } from '../components/ui.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { IcExport, IcArrowL } from '../components/icons.jsx'
import { REPORTS, PREVIEW_GOODS } from '../data/inventoryReports.js'

// Отдельная страница просмотра отчёта по товарам
export default function InventoryReportView() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [from, setFrom] = useState('2026-06-01')
  const [to, setTo] = useState('2026-06-30')
  const [branch, setBranch] = useState('Все филиалы')
  const [search, setSearch] = useState('')

  const report = REPORTS.find((r) => r.id === slug)
  const rows = PREVIEW_GOODS.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))

  if (!report) {
    return (
      <>
        <PageHead crumbs="Отчёты по товарам" title="Отчёт не найден" />
        <Button variant="secondary" onClick={() => navigate('/business/inventory-reports')}><IcArrowL size={16} /> К списку отчётов</Button>
      </>
    )
  }

  return (
    <>
      <PageHead
        crumbs="Отчёты по товарам"
        title={report.title}
        sub={report.desc}
        actions={<Button><IcExport size={16} /> Экспорт (Excel)</Button>}
      />

      <div className="toolbar">
        <span className="small muted">Период с:</span>
        <DatePicker value={from} onChange={setFrom} style={{ width: 160 }} />
        <span className="small muted">по:</span>
        <DatePicker value={to} onChange={setTo} style={{ width: 160 }} />
        <span className="small muted" style={{ marginLeft: 8 }}>Филиал:</span>
        <Select value={branch} onChange={(e) => setBranch(e.target.value)} options={['Все филиалы', 'Центральный', 'Северный', 'Южный']} style={{ width: 180 }} />
        <div className="spacer" />
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по названию" style={{ minWidth: 240 }} />
      </div>

      <Card title={`${report.title} — данные`} pad={false}>
        <Table
          columns={[{ label: 'Товар' }, { label: 'Поставщик' }, { label: 'Остаток', num: true }]}
          rows={rows}
          renderRow={(g, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{g.name}</td>
              <td className="small muted">{g.supplier}</td>
              <td className="num">{g.stock}</td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}
