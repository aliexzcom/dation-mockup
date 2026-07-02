import { useState } from 'react'
import { Switch, Badge } from '../components/ui.jsx'
import { IcSun, IcMoon, IcArrowL, IcArrowR } from '../icons.jsx'
import { COMPANY } from '../data.js'

const TABS = [
  { key: 'general', label: 'Общие' },
  { key: 'integrations', label: 'Интеграции' },
]

const INTEGRATIONS = [
  {
    id: 'payme', name: 'Payme', desc: 'Приём оплат через Payme', color: '#00C3F7', mark: 'P', connected: true,
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: '5e7a1b2c3d4e5f6a7b8c9d0e' },
      { key: 'key', label: 'Ключ (Secret Key)', placeholder: '••••••••••••', type: 'password' },
    ],
  },
  {
    id: 'click', name: 'Click', desc: 'Приём оплат через Click', color: '#0098EA', mark: 'C', connected: true,
    fields: [
      { key: 'merchant_id', label: 'Merchant ID', placeholder: '12345' },
      { key: 'service_id', label: 'Service ID', placeholder: '67890' },
      { key: 'secret', label: 'Secret Key', placeholder: '••••••••••••', type: 'password' },
    ],
  },
  {
    id: 'tg', name: 'Telegram-бот (Mini App)', desc: 'Онлайн-запись клиентов и уведомления', color: '#229ED9', mark: 'TG', connected: true,
    fields: [
      { key: 'token', label: 'Bot API Token', placeholder: '123456789:AA...' },
      { key: 'username', label: 'Username бота', placeholder: '@my_salon_bot' },
    ],
  },
  {
    id: 'fiscal', name: 'Онлайн-касса (qpos)', desc: 'Фискализация чеков', color: '#6B7280', mark: 'Q', connected: false, soon: true,
    fields: [
      { key: 'tin', label: 'ИНН', placeholder: '123456789' },
      { key: 'terminal', label: 'ID терминала', placeholder: 'LG4202...' },
      { key: 'fm', label: 'Серийный номер ФМ', placeholder: 'LG4202116...' },
      { key: 'ofd', label: 'Адрес ОФД', placeholder: 'https://ofd.soliq.uz' },
      { key: 'endpoint', label: 'Endpoint qpos.exe', placeholder: 'http://127.0.0.1:2040/api' },
    ],
  },
]

export default function Settings({ branch, theme }) {
  const [tab, setTab] = useState('general')
  const [autoPrint, setAutoPrint] = useState(true)
  const [sound, setSound] = useState(true)
  const [showCancelled, setShowCancelled] = useState(false)
  const [intg, setIntg] = useState(() => Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected])))
  const [openIntg, setOpenIntg] = useState(null)

  return (
    <>
      <div className="tabs">
        {TABS.map((t) => (
          <div key={t.key} className={'tab' + (tab === t.key ? ' active' : '')} onClick={() => setTab(t.key)}>{t.label}</div>
        ))}
      </div>

      {tab === 'general' && (
        <div style={{ maxWidth: 640 }}>
          <div className="card card-pad">
            <div className="sec-title" style={{ marginTop: 0 }}>Оформление</div>
            <div className="row-line" style={{ borderBottom: 0, paddingBottom: 0 }}>
              <div className="rl-body"><div className="rl-t">Тема интерфейса</div><div className="rl-s">Светлый или тёмный фон</div></div>
              <div className="seg">
                <button className={'seg-btn' + (!theme.dark ? ' active' : '')} onClick={() => { if (theme.dark) theme.toggle() }}><IcSun size={16} /> Светлый</button>
                <button className={'seg-btn' + (theme.dark ? ' active' : '')} onClick={() => { if (!theme.dark) theme.toggle() }}><IcMoon size={16} /> Тёмный</button>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="sec-title" style={{ marginTop: 0 }}>Терминал</div>
            <div className="row-line">
              <div className="rl-body"><div className="rl-t">Заведение</div><div className="rl-s">{COMPANY.name}</div></div>
            </div>
            <div className="row-line">
              <div className="rl-body"><div className="rl-t">Филиал</div><div className="rl-s">{branch.name}</div></div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="sec-title" style={{ marginTop: 0 }}>Поведение</div>
            <div className="row-line">
              <div className="rl-body"><div className="rl-t">Автопечать чека после оплаты</div><div className="rl-s">Печатать чек сразу при проведении оплаты</div></div>
              <Switch on={autoPrint} onClick={() => setAutoPrint((v) => !v)} />
            </div>
            <div className="row-line">
              <div className="rl-body"><div className="rl-t">Звук новой записи</div><div className="rl-s">Сигнал при поступлении записи из Mini App</div></div>
              <Switch on={sound} onClick={() => setSound((v) => !v)} />
            </div>
            <div className="row-line">
              <div className="rl-body"><div className="rl-t">Показывать отменённые</div><div className="rl-s">Отображать отменённые записи в журнале</div></div>
              <Switch on={showCancelled} onClick={() => setShowCancelled((v) => !v)} />
            </div>
          </div>
        </div>
      )}

      {tab === 'integrations' && (
        openIntg ? (
          <IntegrationDetail
            intg={INTEGRATIONS.find((i) => i.id === openIntg)}
            connected={intg[openIntg]}
            onConnect={() => setIntg((p) => ({ ...p, [openIntg]: true }))}
            onDisconnect={() => setIntg((p) => ({ ...p, [openIntg]: false }))}
            onBack={() => setOpenIntg(null)}
          />
        ) : (
          <div style={{ maxWidth: 640 }}>
            <div className="note" style={{ marginBottom: 16 }}>
              Сервисы оплаты и записи. Откройте интеграцию, чтобы ввести данные подключения.
            </div>
            {INTEGRATIONS.map((i) => (
              <div key={i.id} className="intg" onClick={() => setOpenIntg(i.id)} style={{ cursor: 'pointer' }}>
                <div className="intg-logo" style={{ background: i.color }}>{i.mark}</div>
                <div className="intg-body">
                  <div className="t">{i.name}</div>
                  <div className="s">{i.desc}</div>
                </div>
                {i.soon
                  ? <Badge cls="gray">Скоро</Badge>
                  : <Badge cls={intg[i.id] ? 'green' : 'gray'}>{intg[i.id] ? 'Подключено' : 'Отключено'}</Badge>}
                <IcArrowR size={16} style={{ color: 'var(--text-faint)', marginLeft: 4 }} />
              </div>
            ))}
          </div>
        )
      )}
    </>
  )
}

// Отдельная страница интеграции: данные для подключения + управление статусом.
function IntegrationDetail({ intg, connected, onConnect, onDisconnect, onBack }) {
  const [vals, setVals] = useState({})
  const set = (k, v) => setVals((p) => ({ ...p, [k]: v }))

  return (
    <div style={{ maxWidth: 640 }}>
      <button className="btn ghost sm" onClick={onBack} style={{ marginBottom: 16 }}>
        <IcArrowL size={16} /> Все интеграции
      </button>

      <div className="intg" style={{ marginBottom: 16, cursor: 'default' }}>
        <div className="intg-logo" style={{ background: intg.color }}>{intg.mark}</div>
        <div className="intg-body">
          <div className="t">{intg.name}</div>
          <div className="s">{intg.desc}</div>
        </div>
        {intg.soon
          ? <Badge cls="gray">Скоро</Badge>
          : <Badge cls={connected ? 'green' : 'gray'}>{connected ? 'Подключено' : 'Отключено'}</Badge>}
      </div>

      <div className="card card-pad">
        <div className="sec-title" style={{ marginTop: 0 }}>Данные для подключения</div>
        {intg.fields.map((f) => (
          <div className="field" key={f.key}>
            <label>{f.label}</label>
            <input
              className="input"
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={vals[f.key] || ''}
              onChange={(e) => set(f.key, e.target.value)}
              disabled={intg.soon}
            />
          </div>
        ))}

        {intg.soon ? (
          <div className="note" style={{ marginTop: 4 }}>Интеграция станет доступна позже.</div>
        ) : connected ? (
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn secondary" onClick={onBack}>Сохранить</button>
            <button className="btn danger" onClick={() => { onDisconnect(); onBack() }}>Отключить</button>
          </div>
        ) : (
          <button className="btn" style={{ marginTop: 4 }} onClick={() => { onConnect(); onBack() }}>Подключить</button>
        )}
      </div>
    </div>
  )
}
