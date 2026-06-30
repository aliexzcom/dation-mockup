import { useState } from 'react'
import { PageHead, Button, Card, Tabs, Badge, Table, Field, Input, Textarea, Select, Switch, Drawer } from '../components/ui.jsx'
import { DateTimePicker } from '../components/DateTimePicker.jsx'
import { IcPlus, IcEdit } from '../components/icons.jsx'

// ── Мок-данные триггеров ──────────────────────────────────────────────────────
const INIT_TRIGGERS = [
  {
    id: 1, group: 'client',
    name: 'Подтверждение записи',
    template: 'Здравствуйте, {{имя}}! Ваша запись к {{сотрудник}} на {{услуга}} подтверждена. Дата: {{дата}} в {{время}}.',
    timing: 'Сразу после создания',
    timingVal: '', on: true,
  },
  {
    id: 2, group: 'client',
    name: 'Напоминание о записи',
    template: 'Напоминаем: завтра в {{время}} вас ждёт {{сотрудник}} ({{услуга}}). Ждём вас!',
    timing: 'За N часов/дней',
    timingVal: '24', on: true,
  },
  {
    id: 3, group: 'client',
    name: 'Изменение записи',
    template: 'Ваша запись изменена. Новая дата: {{дата}} в {{время}} к {{сотрудник}}.',
    timing: 'Сразу после изменения',
    timingVal: '', on: true,
  },
  {
    id: 4, group: 'client',
    name: 'Отмена записи',
    template: 'Ваша запись на {{дата}} отменена. Будем рады видеть вас снова — запишитесь в удобное время.',
    timing: 'Сразу после отмены',
    timingVal: '', on: true,
  },
  {
    id: 5, group: 'client',
    name: 'Поздравление с днём рождения',
    template: 'С днём рождения, {{имя}}! В честь праздника дарим вам скидку 15% на любую услугу в этом месяце.',
    timing: 'В день рождения в 10:00',
    timingVal: '', on: true,
  },
  {
    id: 6, group: 'client',
    name: 'Давно не были',
    template: 'Скучаем по вам, {{имя}}! Прошло уже {{дней}} дней с вашего последнего визита. Запишитесь онлайн — это займёт минуту.',
    timing: 'Через N дней после визита',
    timingVal: '60', on: false,
  },
  {
    id: 7, group: 'client',
    name: 'Запрос отзыва',
    template: 'Спасибо за визит, {{имя}}! Пожалуйста, оцените качество услуги — это займёт 30 секунд.',
    timing: 'Через N часов после визита',
    timingVal: '3', on: true,
  },
  {
    id: 8, group: 'staff',
    name: 'Новая запись (сотруднику)',
    template: 'Новая запись: {{клиент}} на {{услуга}} {{дата}} в {{время}}. Источник: Mini App.',
    timing: 'Сразу после создания',
    timingVal: '', on: true,
  },
]

// ── Мок-данные рассылок ───────────────────────────────────────────────────────
const INITIAL_BROADCASTS = [
  {
    id: 1, name: 'Акция «Лето»', segment: 'Все клиенты', sent: '10 июн 2026', status: 'done',
    delivered: 842, read: 610, converted: 87,
  },
  {
    id: 2, name: 'Возврат неактивных', segment: 'Не было 60+ дней', sent: '1 июн 2026', status: 'done',
    delivered: 214, read: 138, converted: 31,
  },
  {
    id: 3, name: 'Новая услуга — ламинирование', segment: 'Постоянные клиенты', sent: '20 мая 2026', status: 'done',
    delivered: 503, read: 389, converted: 62,
  },
  {
    id: 4, name: 'Напоминание о записи (ручная)', segment: 'Клиенты без записи', sent: '—', status: 'draft',
    delivered: 0, read: 0, converted: 0,
  },
]

const SEGMENTS = ['Все клиенты', 'Постоянные клиенты', 'Новые клиенты', 'Не было 60+ дней', 'Клиенты без записи', 'С днём рождения в этом месяце']
const TEMPLATES_LIST = [
  'Акционное предложение',
  'Возврат неактивных клиентов',
  'Анонс новой услуги',
  'Поздравление с праздником',
  'Свободный текст',
]

const STATUS_COLORS = { done: 'green', draft: 'gray', scheduled: 'blue', error: 'red' }
const STATUS_LABELS = { done: 'Отправлена', draft: 'Черновик', scheduled: 'Запланирована', error: 'Ошибка' }

const EMPTY_FORM = {
  name: '',
  segment: SEGMENTS[0],
  template: TEMPLATES_LIST[0],
  text: '',
  schedule: '',
  buttons: true,
}

// ── Компонент строки триггера ─────────────────────────────────────────────────
function TriggerRow({ tr, onToggle, onEdit }) {
  return (
    <div className="list-line" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <Switch on={tr.on} onClick={() => onToggle(tr.id)} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, marginBottom: 2 }}>{tr.name}</div>
        <div className="note" style={{ marginBottom: 4 }}>{tr.template}</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="muted small">Тайминг: {tr.timing}{tr.timingVal ? ` (${tr.timingVal} ч/дн.)` : ''}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onEdit(tr)}>
        <IcEdit size={14} />
      </Button>
    </div>
  )
}

// Сопоставление маршрута раздела и подписи вкладки
const VIEW_TABS = { auto: 'Автоуведомления', broadcasts: 'Рассылки', settings: 'Настройки' }

// ══════════════════════════════════════════════════════════════════════════════
// view: 'auto' | 'broadcasts' | 'settings' — раздел приходит из меню (маршрута).
// Если view не задан — показываем вкладки внутри страницы.
export default function Notifications({ view = null }) {
  const [tab, setTab] = useState('Автоуведомления')
  const activeTab = view ? VIEW_TABS[view] : tab
  const [triggers, setTriggers] = useState(INIT_TRIGGERS)
  const [editTrigger, setEditTrigger] = useState(null)  // drawer edit trigger
  const [broadcastDrawer, setBroadcastDrawer] = useState(false)

  // История рассылок — управляемое состояние
  const [rows, setRows] = useState(INITIAL_BROADCASTS)

  // Форма создания рассылки — единый объект
  const [form, setForm] = useState(EMPTY_FORM)

  // Настройки
  const [botName, setBotName] = useState('DationBot')
  const [botWelcome, setBotWelcome] = useState('Добро пожаловать! Я помогу вам записаться на услуги и буду держать вас в курсе.')
  const [settingTriggers, setSettingTriggers] = useState(INIT_TRIGGERS)

  // Переключатели согласий
  const [consentAuto, setConsentAuto] = useState(true)
  const [consentStop, setConsentStop] = useState(true)
  const [consentNotify, setConsentNotify] = useState(false)

  function toggleTrigger(id) {
    setTriggers(ts => ts.map(t => t.id === id ? { ...t, on: !t.on } : t))
  }
  function openEditTrigger(tr) {
    setEditTrigger({ ...tr })
  }
  function saveEditTrigger() {
    setTriggers(ts => ts.map(t => t.id === editTrigger.id ? editTrigger : t))
    setEditTrigger(null)
  }

  function handleLaunch() {
    if (!form.name?.trim()) return
    const newRow = {
      id: Date.now(),
      name: form.name.trim(),
      segment: form.segment,
      sent: form.schedule ? form.schedule.replace('T', ' ') : 'Сейчас',
      status: 'scheduled',
      delivered: '—',
      read: '—',
      converted: 0,
    }
    setRows([newRow, ...rows])
    setForm(EMPTY_FORM)
    setBroadcastDrawer(false)
  }

  function handleSaveDraft() {
    if (!form.name?.trim()) return
    const newRow = {
      id: Date.now(),
      name: form.name.trim(),
      segment: form.segment,
      sent: '—',
      status: 'draft',
      delivered: 0,
      read: 0,
      converted: 0,
    }
    setRows([newRow, ...rows])
    setForm(EMPTY_FORM)
    setBroadcastDrawer(false)
  }

  const clientTriggers = triggers.filter(t => t.group === 'client')
  const staffTriggers = triggers.filter(t => t.group === 'staff')

  return (
    <>
      <PageHead
        crumbs="Уведомления"
        title="Уведомления"
        sub="Автоматические триггерные уведомления и ручные рассылки через Telegram-бота."
        actions={activeTab === 'Рассылки' ? (
          <Button onClick={() => setBroadcastDrawer(true)}>
            <IcPlus size={16} /> Создать рассылку
          </Button>
        ) : null}
      />

      <div className="note" style={{ marginBottom: 16, padding: '10px 14px', background: '#F5F3FF', borderRadius: 8, borderLeft: '3px solid #7C3AED' }}>
        Все уведомления отправляются исключительно через Telegram-бота. SMS-рассылки не используются.
        Сообщения получают только клиенты, начавшие диалог с ботом и давшие согласие на получение уведомлений.
      </div>

      {!view && (
        <Tabs tabs={['Автоуведомления', 'Рассылки', 'Настройки']} active={tab} onChange={setTab} />
      )}

      {/* ── Вкладка: Автоуведомления ── */}
      {activeTab === 'Автоуведомления' && (
        <>
          <Card title="Уведомления клиентам" style={{ marginBottom: 16 }}>
            {clientTriggers.map(tr => (
              <TriggerRow key={tr.id} tr={tr} onToggle={toggleTrigger} onEdit={openEditTrigger} />
            ))}
          </Card>

          <Card title="Уведомления сотрудникам и администратору">
            {staffTriggers.map(tr => (
              <TriggerRow key={tr.id} tr={tr} onToggle={toggleTrigger} onEdit={openEditTrigger} />
            ))}
          </Card>
        </>
      )}

      {/* ── Вкладка: Рассылки ── */}
      {activeTab === 'Рассылки' && (
        <>
          <div className="note" style={{ marginBottom: 16 }}>
            Рассылки получают только клиенты, начавшие диалог с ботом и давшие согласие. Среднее открытие в Telegram — 70–80%.
          </div>

          <Card title="История рассылок" style={{ marginBottom: 16 }}>
            <Table
              columns={[
                { label: 'Название' },
                { label: 'Сегмент' },
                { label: 'Дата' },
                { label: 'Статус' },
                { label: 'Доставлено', num: true },
                { label: 'Прочитано', num: true },
                { label: 'Конверсия в запись', num: true },
              ]}
              rows={rows}
              renderRow={(r, i) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td><span className="muted">{r.segment}</span></td>
                  <td>{r.sent}</td>
                  <td><Badge color={STATUS_COLORS[r.status]}>{STATUS_LABELS[r.status]}</Badge></td>
                  <td className="num">{typeof r.delivered === 'number' && r.delivered > 0 ? r.delivered : '—'}</td>
                  <td className="num">
                    {typeof r.read === 'number' && r.read > 0 && typeof r.delivered === 'number' && r.delivered > 0 ? (
                      <span>{r.read} <span className="muted small">({Math.round(r.read / r.delivered * 100)}%)</span></span>
                    ) : '—'}
                  </td>
                  <td className="num">
                    {typeof r.converted === 'number' && r.converted > 0 && typeof r.delivered === 'number' && r.delivered > 0 ? (
                      <span>{r.converted} <span className="muted small">({Math.round(r.converted / r.delivered * 100)}%)</span></span>
                    ) : '—'}
                  </td>
                </tr>
              )}
            />
          </Card>

          <Card title="Шаблоны сообщений">
            {TEMPLATES_LIST.map((tpl, i) => (
              <div key={i} className="list-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{tpl}</div>
                  <div className="muted small">Переменные: {'{{имя}}'}, {'{{услуга}}'}, {'{{дата}}'}, {'{{сотрудник}}'}</div>
                </div>
                <Button variant="ghost" size="sm"><IcEdit size={14} /></Button>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* ── Вкладка: Настройки ── */}
      {activeTab === 'Настройки' && (
        <>
          <div className="grid grid-2" style={{ marginBottom: 16 }}>
            <Card title="Профиль бота">
              <Field label="Имя бота">
                <Input value={botName} onChange={e => setBotName(e.target.value)} />
              </Field>
              <Field label="Приветственное сообщение">
                <Textarea value={botWelcome} onChange={e => setBotWelcome(e.target.value)} rows={4} />
              </Field>
              <div className="note" style={{ marginTop: 8 }}>Имя и аватар бота задаются через @BotFather в Telegram.</div>
            </Card>

            <Card title="Управление согласиями">
              <div className="list-line">
                <div>
                  <div style={{ fontWeight: 500 }}>Автоматически запрашивать согласие</div>
                  <div className="muted small">При первом касании клиента с ботом</div>
                </div>
                <Switch on={consentAuto} onClick={() => setConsentAuto(v => !v)} />
              </div>
              <div className="list-line">
                <div>
                  <div style={{ fontWeight: 500 }}>Отписка по команде /stop</div>
                  <div className="muted small">Клиент может в любой момент отписаться</div>
                </div>
                <Switch on={consentStop} onClick={() => setConsentStop(v => !v)} />
              </div>
              <div className="list-line">
                <div>
                  <div style={{ fontWeight: 500 }}>Уведомлять при отписке</div>
                  <div className="muted small">Отправлять уведомление администратору</div>
                </div>
                <Switch on={consentNotify} onClick={() => setConsentNotify(v => !v)} />
              </div>
            </Card>
          </div>

          <Card title="Тексты шаблонов и тайминги">
            {settingTriggers.map((tr, i) => (
              <div key={tr.id} style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {tr.name}
                  <Badge color={tr.group === 'staff' ? 'blue' : 'gray'}>
                    {tr.group === 'staff' ? 'Сотрудникам' : 'Клиентам'}
                  </Badge>
                </div>
                <Field label="Текст шаблона">
                  <Textarea
                    value={tr.template}
                    onChange={e => setSettingTriggers(ts => ts.map(t => t.id === tr.id ? { ...t, template: e.target.value } : t))}
                    rows={3}
                  />
                </Field>
                {tr.timingVal !== '' && (
                  <Field label="Тайминг (часов/дней)">
                    <Input
                      type="number"
                      value={tr.timingVal}
                      onChange={e => setSettingTriggers(ts => ts.map(t => t.id === tr.id ? { ...t, timingVal: e.target.value } : t))}
                      style={{ width: 120 }}
                    />
                  </Field>
                )}
                {i < settingTriggers.length - 1 && <div className="divider" />}
              </div>
            ))}
            <div style={{ textAlign: 'right' }}>
              <Button>Сохранить шаблоны</Button>
            </div>
          </Card>
        </>
      )}

      {/* ── Drawer: редактировать триггер ── */}
      <Drawer
        title={editTrigger ? `Редактировать: ${editTrigger.name}` : ''}
        open={!!editTrigger}
        onClose={() => setEditTrigger(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTrigger(null)}>Отмена</Button>
            <Button onClick={saveEditTrigger}>Сохранить</Button>
          </>
        }
      >
        {editTrigger && (
          <>
            <Field label="Название">
              <Input value={editTrigger.name} onChange={e => setEditTrigger({ ...editTrigger, name: e.target.value })} />
            </Field>
            <Field label="Текст шаблона">
              <Textarea
                value={editTrigger.template}
                onChange={e => setEditTrigger({ ...editTrigger, template: e.target.value })}
                rows={5}
              />
            </Field>
            <div className="muted small" style={{ marginBottom: 12 }}>
              Доступные переменные: {'{{имя}}'}, {'{{услуга}}'}, {'{{сотрудник}}'}, {'{{дата}}'}, {'{{время}}'}, {'{{дней}}'}
            </div>
            {editTrigger.timingVal !== '' && (
              <Field label="Тайминг (часов/дней до или после события)">
                <Input
                  type="number"
                  value={editTrigger.timingVal}
                  onChange={e => setEditTrigger({ ...editTrigger, timingVal: e.target.value })}
                />
              </Field>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <Switch on={editTrigger.on} onClick={() => setEditTrigger({ ...editTrigger, on: !editTrigger.on })} />
              <span>{editTrigger.on ? 'Включено' : 'Отключено'}</span>
            </div>
          </>
        )}
      </Drawer>

      {/* ── Drawer: создать рассылку ── */}
      <Drawer
        title="Создать рассылку"
        open={broadcastDrawer}
        onClose={() => { setBroadcastDrawer(false); setForm(EMPTY_FORM) }}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setBroadcastDrawer(false); setForm(EMPTY_FORM) }}>Отмена</Button>
            <Button variant="ghost" onClick={handleSaveDraft} disabled={!form.name?.trim()}>Сохранить черновик</Button>
            <Button onClick={handleLaunch} disabled={!form.name?.trim()}>Запустить</Button>
          </>
        }
      >
        <Field label="Название рассылки *">
          <Input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Например: Акция на июль"
          />
        </Field>
        <Field label="Сегмент получателей">
          <Select options={SEGMENTS} value={form.segment} onChange={e => setForm({ ...form, segment: e.target.value })} />
        </Field>
        <Field label="Шаблон">
          <Select options={TEMPLATES_LIST} value={form.template} onChange={e => setForm({ ...form, template: e.target.value })} />
        </Field>
        <Field label="Текст сообщения">
          <Textarea
            value={form.text}
            onChange={e => setForm({ ...form, text: e.target.value })}
            rows={5}
            placeholder="Здравствуйте, {{имя}}! Сообщаем вам о ..."
          />
        </Field>
        <div className="muted small" style={{ marginBottom: 12 }}>
          Переменные: {'{{имя}}'}, {'{{услуга}}'}, {'{{дата}}'}
        </div>
        <div className="list-line" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Switch on={form.buttons} onClick={() => setForm({ ...form, buttons: !form.buttons })} />
          <span>Добавить инлайн-кнопки Telegram</span>
        </div>
        {form.buttons && (
          <div style={{ padding: '10px 14px', background: '#F5F3FF', borderRadius: 8, marginBottom: 16 }}>
            <div className="muted small" style={{ marginBottom: 8 }}>Кнопки в сообщении:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tag">Записаться</span>
              <span className="tag">Перенести запись</span>
              <span className="tag">Подробнее</span>
            </div>
          </div>
        )}
        <Field label="Запланировать отправку (дата и время)">
          <DateTimePicker
            date={(form.schedule || '').split('T')[0] || ''}
            time={(form.schedule || '').split('T')[1] || ''}
            onChange={(d, t) => setForm({ ...form, schedule: `${d}T${t}` })}
          />
        </Field>
        <div className="note" style={{ marginTop: 8 }}>
          Если дата не указана — рассылка будет отправлена немедленно после запуска.
        </div>
      </Drawer>
    </>
  )
}
