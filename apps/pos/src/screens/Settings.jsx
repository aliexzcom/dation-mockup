import { useState } from 'react'
import { Switch, Badge } from '../components/ui.jsx'
import { COMPANY } from '../data.js'

const TABS = [
  { key: 'general', label: 'Общие' },
  { key: 'integrations', label: 'Интеграции' },
]

const INTEGRATIONS = [
  { id: 'payme', name: 'Payme', desc: 'Приём оплат через Payme', color: '#00C3F7', mark: 'P', connected: true },
  { id: 'click', name: 'Click', desc: 'Приём оплат через Click', color: '#0098EA', mark: 'C', connected: true },
  { id: 'tg', name: 'Telegram-бот (Mini App)', desc: 'Онлайн-запись клиентов и уведомления', color: '#229ED9', mark: 'TG', connected: true },
  { id: 'fiscal', name: 'Онлайн-касса (qpos)', desc: 'Фискализация чеков', color: '#6B7280', mark: 'Q', connected: false, soon: true },
]

export default function Settings({ branch }) {
  const [tab, setTab] = useState('general')
  const [autoPrint, setAutoPrint] = useState(true)
  const [sound, setSound] = useState(true)
  const [showCancelled, setShowCancelled] = useState(false)
  const [intg, setIntg] = useState(() => Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected])))

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
        <div style={{ maxWidth: 640 }}>
          <div className="note" style={{ marginBottom: 16 }}>
            Подключённые сервисы оплаты и записи. Управление ключами и настройками — в веб-админке.
          </div>
          {INTEGRATIONS.map((i) => (
            <div key={i.id} className="intg">
              <div className="intg-logo" style={{ background: i.color }}>{i.mark}</div>
              <div className="intg-body">
                <div className="t">{i.name}</div>
                <div className="s">{i.desc}</div>
              </div>
              {i.soon ? (
                <Badge cls="gray">Скоро</Badge>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Badge cls={intg[i.id] ? 'green' : 'gray'}>{intg[i.id] ? 'Подключено' : 'Отключено'}</Badge>
                  <Switch on={intg[i.id]} onClick={() => setIntg((p) => ({ ...p, [i.id]: !p[i.id] }))} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
