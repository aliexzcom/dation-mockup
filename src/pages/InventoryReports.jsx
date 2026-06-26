import { useState } from 'react'
import { PageHead, Button, Card, Table, Field, Input, Select, Drawer } from '../components/ui.jsx'
import { IcExport } from '../components/icons.jsx'

const REPORTS = [
  { title: 'Остатки на дату',     desc: 'Текущий остаток по каждому товару в разрезе складов и филиалов', icon: 'О' },
  { title: 'Движение товара',     desc: 'Приход, расход и перемещения за выбранный период',                icon: 'Д' },
  { title: 'Продажи товаров',     desc: 'Выручка и количество по товарам, проданным через кассу/услуги',   icon: 'П' },
  { title: 'Себестоимость услуг', desc: 'Расход материалов по техкартам в разрезе оказанных услуг',         icon: 'С' },
]

const PREVIEW_GOODS = [
  { name: 'Шампунь профессиональный Kerastase', supplier: 'КосмоПро', stock: 12 },
  { name: 'Краска для волос Wella 8/1', supplier: 'Вэлла Рус', stock: 3 },
  { name: 'Перчатки латексные (пара)', supplier: 'МедСнаб', stock: 240 },
  { name: 'Лак для ногтей OPI Red', supplier: 'БьютиТрейд', stock: 22 },
  { name: 'Гель для укладки Redken', supplier: 'КосмоПро', stock: 6 },
  { name: 'Кератин BT Gold 100 мл', supplier: 'АминоПро', stock: 2 },
]

// Отчёты по товарам — уровень бизнеса (сводно по всей сети)
export default function InventoryReports() {
  const [period, setPeriod] = useState('Июнь 2026')
  const [branch, setBranch] = useState('Все филиалы')
  const [openReport, setOpenReport] = useState(null)

  return (
    <>
      <PageHead
        crumbs="Отчёты по товарам"
        title="Отчёты по товарам"
        sub="Складская аналитика по всей сети: остатки, движение, продажи и себестоимость."
      />

      <div className="toolbar">
        <span className="small muted">Период:</span>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} options={['Сегодня', 'Эта неделя', 'Июнь 2026', 'Май 2026', 'Апрель 2026', 'Произвольный']} style={{ width: 160 }} />
        <span className="small muted" style={{ marginLeft: 8 }}>Филиал:</span>
        <Select value={branch} onChange={(e) => setBranch(e.target.value)} options={['Все филиалы', 'Центральный', 'Северный', 'Южный']} style={{ width: 180 }} />
        <div className="spacer" />
        <Button variant="ghost"><IcExport size={16} /> Экспорт</Button>
      </div>

      <div className="grid grid-2">
        {REPORTS.map((r, i) => (
          <div key={i} onClick={() => setOpenReport(r)} style={{ cursor: 'pointer' }}>
            <Card actions={<Button size="sm" variant="secondary">Открыть</Button>}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: '#EDE9FE', color: 'var(--violet)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>
                  {r.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
                  <div className="small muted">{r.desc}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Drawer: превью отчёта */}
      <Drawer
        title={openReport ? openReport.title : ''}
        open={!!openReport}
        onClose={() => setOpenReport(null)}
        footer={
          <>
            <Button><IcExport size={14} /> Экспорт (Excel)</Button>
            <Button variant="secondary" onClick={() => setOpenReport(null)}>Закрыть</Button>
          </>
        }
      >
        {openReport && (
          <>
            <p className="muted" style={{ marginTop: 0 }}>{openReport.desc}</p>
            <div className="row-fields">
              <Field label="Период"><Input defaultValue={period} /></Field>
              <Field label="Филиал"><Input defaultValue={branch} /></Field>
            </div>
            <div className="note small">Отчёт сформирован за «{period}», {branch}. Ниже — превью данных.</div>
            <div className="section-title">Превью</div>
            <Table
              columns={[{ label: 'Товар' }, { label: 'Поставщик' }, { label: 'Остаток', num: true }]}
              rows={PREVIEW_GOODS}
              renderRow={(g, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{g.name}</td>
                  <td className="small muted">{g.supplier}</td>
                  <td className="num">{g.stock}</td>
                </tr>
              )}
            />
          </>
        )}
      </Drawer>
    </>
  )
}
