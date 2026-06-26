import { useState } from 'react'
import { PageHead, Button, Card, Stat, Tabs, Badge, Table, Field, Select, Drawer, KV } from '../components/ui.jsx'
import { IcExport } from '../components/icons.jsx'

// ── Периоды и филиалы ─────────────────────────────────────────────────────────
const PERIODS = ['Сегодня', 'Эта неделя', 'Этот месяц', 'Прошлый месяц', 'Этот квартал', 'Произвольный период']
const BRANCHES = ['Все филиалы', 'Центр (ул. Ленина, 12)', 'Север (пр. Победы, 45)', 'Юг (ул. Садовая, 7)']

// ── Псевдо-данные для барчарта (выручка по дням) ──────────────────────────────
const REVENUE_BARS = [
  { label: 'Пн', cur: 68, prev: 52 },
  { label: 'Вт', cur: 82, prev: 74 },
  { label: 'Ср', cur: 75, prev: 61 },
  { label: 'Чт', cur: 91, prev: 80 },
  { label: 'Пт', cur: 110, prev: 95 },
  { label: 'Сб', cur: 130, prev: 112 },
  { label: 'Вс', cur: 55, prev: 48 },
]

// ── Псевдо-данные загрузки по сотрудникам ────────────────────────────────────
const STAFF_LOAD = [
  { name: 'Анна Морозова', load: 88, prev: 82 },
  { name: 'Игорь Лебедев', load: 74, prev: 70 },
  { name: 'Светлана Котова', load: 91, prev: 85 },
  { name: 'Дмитрий Орлов', load: 62, prev: 68 },
  { name: 'Наталья Пак', load: 79, prev: 75 },
]

// ── Отчёты ────────────────────────────────────────────────────────────────────
const REPORT_GROUPS = [
  {
    group: 'Выручка',
    reports: [
      { name: 'По дням', desc: 'Динамика выручки за период с разбивкой по дням.' },
      { name: 'По услугам', desc: 'Выручка в разрезе каждой услуги или категории.' },
      { name: 'По сотрудникам', desc: 'Индивидуальная выработка каждого мастера.' },
      { name: 'По способам оплаты', desc: 'Наличные, карта, онлайн, бонусы — доли и суммы.' },
      { name: 'По филиалам', desc: 'Сравнение выручки между точками сети.' },
    ],
  },
  {
    group: 'Сотрудники',
    reports: [
      { name: 'Выработка и загрузка', desc: 'Рабочее время, количество визитов, сумма услуг.' },
      { name: 'Средний чек', desc: 'Средняя стоимость визита по каждому мастеру.' },
      { name: 'Доля повторных клиентов', desc: '% клиентов, вернувшихся к конкретному мастеру.' },
      { name: 'Рейтинг сотрудников', desc: 'Сводный рейтинг по выручке, загрузке и отзывам.' },
    ],
  },
  {
    group: 'Клиенты',
    reports: [
      { name: 'Новые / потерянные / вернувшиеся', desc: 'Движение клиентской базы за период.' },
      { name: 'LTV клиентов', desc: 'Пожизненная ценность по сегментам и каналам.' },
      { name: 'RFM-анализ', desc: 'Сегментация по давности, частоте и сумме визитов.' },
      { name: 'Источники привлечения', desc: 'Откуда приходят клиенты: Mini App, реклама, сарафан.' },
    ],
  },
  {
    group: 'Записи',
    reports: [
      { name: 'Воронка записи в Mini App', desc: 'Шаги от открытия до подтверждённой записи.' },
      { name: 'Конверсия', desc: 'Доля посетителей Mini App, дошедших до записи.' },
      { name: 'Отмены и неявки', desc: 'Причины и динамика no-show и cancel.' },
    ],
  },
  {
    group: 'Услуги',
    reports: [
      { name: 'Топ услуг', desc: 'Наиболее популярные услуги по количеству и выручке.' },
      { name: 'Маржинальность', desc: 'Прибыль по услугам с учётом материалов и ЗП.' },
    ],
  },
  {
    group: 'Финансы',
    reports: [
      { name: 'P&L (доходы и расходы)', desc: 'Сводный отчёт прибылей и убытков за период.' },
      { name: 'Транзакции', desc: 'Все финансовые операции с фильтрацией.' },
      { name: 'Заработная плата', desc: 'Расчёт ЗП сотрудников по тарифам и начислениям.' },
    ],
  },
  {
    group: 'Склад',
    reports: [
      { name: 'Остатки', desc: 'Текущие складские остатки с оценкой в деньгах.' },
      { name: 'Продажи товаров', desc: 'Реализация товаров за период.' },
      { name: 'Списания', desc: 'Расход материалов при оказании услуг и ручные списания.' },
    ],
  },
  {
    group: 'Маркетинг',
    reports: [
      { name: 'Эффективность рассылок (бот)', desc: 'Доставляемость, открываемость, конверсия рассылок через Telegram.' },
      { name: 'Источники привлечения клиентов', desc: 'Сравнение каналов: Mini App, реклама, сарафан, соцсети.' },
    ],
  },
]

// Плоский список для отображения в grid
const ALL_REPORTS = REPORT_GROUPS.flatMap(g => g.reports.map(r => ({ ...r, group: g.group })))

// ── Вспомогательный компонент: бар-чарт (псевдо) ─────────────────────────────
function BarChart({ bars, maxVal, color = '#7C3AED', prevColor = '#DDD6FE', showPrev = true, valueLabel = '' }) {
  const max = maxVal || Math.max(...bars.map(b => Math.max(b.cur, b.prev || 0)))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, paddingTop: 8 }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 96, width: '100%', justifyContent: 'center' }}>
            {showPrev && b.prev != null && (
              <div
                style={{
                  width: '38%',
                  height: `${Math.round((b.prev / max) * 96)}px`,
                  background: prevColor,
                  borderRadius: '3px 3px 0 0',
                }}
                title={`Прошлый период: ${b.prev}${valueLabel}`}
              />
            )}
            <div
              style={{
                width: showPrev ? '38%' : '60%',
                height: `${Math.round((b.cur / max) * 96)}px`,
                background: color,
                borderRadius: '3px 3px 0 0',
              }}
              title={`Текущий: ${b.cur}${valueLabel}`}
            />
          </div>
          <div className="muted small" style={{ fontSize: 11 }}>{b.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Компонент горизонтального бара загрузки ───────────────────────────────────
function HBar({ name, load, prev }) {
  const delta = load - prev
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13 }}>{name}</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {load}%
          <span style={{ fontSize: 11, color: delta >= 0 ? '#16A34A' : '#EF4444', marginLeft: 6 }}>
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        </span>
      </div>
      <div style={{ background: '#EDE9FE', borderRadius: 4, height: 8, position: 'relative' }}>
        <div style={{ background: '#DDD6FE', borderRadius: 4, height: 8, width: `${prev}%`, position: 'absolute' }} />
        <div style={{ background: '#7C3AED', borderRadius: 4, height: 8, width: `${load}%`, position: 'absolute' }} />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
export default function Analytics() {
  const [tab, setTab] = useState('Дашборд')
  const [period, setPeriod] = useState('Этот месяц')
  const [branch, setBranch] = useState('Все филиалы')
  const [reportGroup, setReportGroup] = useState('Все')
  const [reportDrawer, setReportDrawer] = useState(null)

  const groups = ['Все', ...REPORT_GROUPS.map(g => g.group)]
  const filteredReports = reportGroup === 'Все'
    ? ALL_REPORTS
    : ALL_REPORTS.filter(r => r.group === reportGroup)

  return (
    <>
      <PageHead
        crumbs="Аналитика"
        title="Аналитика и отчёты"
        sub="Ключевые показатели бизнеса, динамика, детальные отчёты и экспорт данных."
        actions={
          <>
            <Button variant="ghost"><IcExport size={16} /> Экспорт</Button>
          </>
        }
      />

      <Tabs tabs={['Дашборд', 'Отчёты']} active={tab} onChange={setTab} />

      {/* ── Вкладка: Дашборд ── */}
      {tab === 'Дашборд' && (
        <>
          {/* Фильтры */}
          <div className="toolbar" style={{ marginBottom: 20 }}>
            <Select
              options={PERIODS}
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
            <Select
              options={BRANCHES}
              value={branch}
              onChange={e => setBranch(e.target.value)}
            />
            <span className="muted small">Сравнение с предыдущим аналогичным периодом</span>
            <div className="spacer" />
            <Button variant="ghost" size="sm"><IcExport size={14} /> Excel</Button>
            <Button variant="ghost" size="sm"><IcExport size={14} /> PDF</Button>
          </div>

          {/* Стат-карточки */}
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

          {/* Графики */}
          <div className="grid grid-2" style={{ marginBottom: 20 }}>
            <Card
              title="Выручка по дням"
              actions={
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, background: '#7C3AED', borderRadius: 2, display: 'inline-block' }} />
                    Текущий
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, background: '#DDD6FE', borderRadius: 2, display: 'inline-block' }} />
                    Прошлый
                  </span>
                </div>
              }
            >
              <BarChart bars={REVENUE_BARS} valueLabel=" тыс. ₽" />
              <div className="note" style={{ marginTop: 8, textAlign: 'center' }}>
                Тыс. ₽ · Текущая неделя vs прошлая
              </div>
            </Card>

            <Card
              title="Загрузка по сотрудникам"
              actions={
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, background: '#7C3AED', borderRadius: 2, display: 'inline-block' }} />
                    Текущий
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span style={{ width: 10, height: 10, background: '#DDD6FE', borderRadius: 2, display: 'inline-block' }} />
                    Прошлый
                  </span>
                </div>
              }
            >
              <div style={{ paddingTop: 8 }}>
                {STAFF_LOAD.map((s, i) => (
                  <HBar key={i} name={s.name} load={s.load} prev={s.prev} />
                ))}
              </div>
            </Card>
          </div>

          {/* Сравнение по филиалам */}
          {branch === 'Все филиалы' && (
            <Card title="Сравнение по филиалам">
              <Table
                columns={[
                  { label: 'Филиал' },
                  { label: 'Выручка', num: true },
                  { label: 'Визиты', num: true },
                  { label: 'Средний чек', num: true },
                  { label: 'Загрузка', num: true },
                  { label: 'No-show', num: true },
                ]}
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
      )}

      {/* ── Вкладка: Отчёты ── */}
      {tab === 'Отчёты' && (
        <>
          {/* Toolbar фильтров и экспорта */}
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <Select
              options={PERIODS}
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
            <Select
              options={BRANCHES}
              value={branch}
              onChange={e => setBranch(e.target.value)}
            />
            <Select
              options={groups}
              value={reportGroup}
              onChange={e => setReportGroup(e.target.value)}
            />
            <div className="spacer" />
            <Button variant="ghost" size="sm"><IcExport size={14} /> Excel</Button>
            <Button variant="ghost" size="sm"><IcExport size={14} /> CSV</Button>
            <Button variant="ghost" size="sm"><IcExport size={14} /> PDF</Button>
          </div>

          <div className="note" style={{ marginBottom: 16, padding: '10px 14px', background: '#F5F3FF', borderRadius: 8, borderLeft: '3px solid #7C3AED' }}>
            Все отчёты поддерживают: настройку периода и фильтров, сравнение с прошлым периодом, drill-down по строкам,
            экспорт в Excel / PDF / CSV, а также сохранение и планирование автоотправки на e-mail.
          </div>

          <div className="grid grid-3">
            {filteredReports.map((r, i) => (
              <Card key={i}>
                <div style={{ padding: '4px 0 12px' }}>
                  <div style={{ marginBottom: 4 }}>
                    <Badge color="gray">{r.group}</Badge>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{r.name}</div>
                  <div className="muted small" style={{ marginBottom: 16, minHeight: 36 }}>{r.desc}</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setReportDrawer(r)}
                    style={{ width: '100%' }}
                  >
                    Открыть
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Drawer: просмотр отчёта ── */}
      <Drawer
        title={reportDrawer ? `${reportDrawer.group}: ${reportDrawer.name}` : ''}
        open={!!reportDrawer}
        onClose={() => setReportDrawer(null)}
        footer={
          <>
            <Button variant="ghost"><IcExport size={14} /> Excel</Button>
            <Button variant="ghost"><IcExport size={14} /> PDF</Button>
            <Button variant="ghost"><IcExport size={14} /> CSV</Button>
            <div className="spacer" />
            <Button variant="secondary" onClick={() => setReportDrawer(null)}>Закрыть</Button>
          </>
        }
      >
        {reportDrawer && (
          <>
            <div className="note" style={{ marginBottom: 16 }}>{reportDrawer.desc}</div>

            <div className="grid grid-2" style={{ marginBottom: 16 }}>
              <Field label="Период">
                <Select options={PERIODS} value={period} onChange={e => setPeriod(e.target.value)} />
              </Field>
              <Field label="Филиал">
                <Select options={BRANCHES} value={branch} onChange={e => setBranch(e.target.value)} />
              </Field>
            </div>

            <KV items={[
              ['Период', period],
              ['Филиал', branch],
              ['Сравнение', 'Включено (прошлый аналогичный период)'],
              ['Drill-down', 'Доступен по клику на строку'],
            ]} />

            <div className="divider" style={{ margin: '16px 0' }} />

            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <BarChart
                bars={REVENUE_BARS}
                valueLabel=""
                color="#7C3AED"
                prevColor="#DDD6FE"
              />
              <div className="muted small" style={{ marginTop: 8 }}>
                Предварительный просмотр данных · Полный отчёт доступен в развёрнутом виде
              </div>
            </div>

            <div className="divider" style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: 8, fontWeight: 600 }}>Планирование автоотправки</div>
            <Field label="Расписание">
              <Select options={['Не отправлять', 'Ежедневно', 'Еженедельно (пн)', 'Ежемесячно (1-е число)']} />
            </Field>
            <Field label="E-mail для отправки">
              <input className="input" type="email" placeholder="admin@example.com" />
            </Field>
            <Button variant="secondary" size="sm">Сохранить расписание</Button>
          </>
        )}
      </Drawer>
    </>
  )
}
