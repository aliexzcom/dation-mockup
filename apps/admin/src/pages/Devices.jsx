import { useState, useEffect } from 'react'
import { PageHead, Card, Button, Badge, Table } from '../components/ui.jsx'
import { IcTrash } from '../components/icons.jsx'
import { currentPairingCode, msUntilNextWindow, PAIRING_WINDOW_MS } from '../pairing.js'

// Подключённые POS-устройства филиала (мок)
const INITIAL_DEVICES = [
  { id: 1, name: 'POS-терминал №1', model: 'Sunmi T2 · ресепшн', lastSeen: 'Сейчас онлайн', online: true },
  { id: 2, name: 'Касса (планшет)', model: 'iPad 10', lastSeen: '6 минут назад', online: true },
  { id: 3, name: 'POS-терминал №2', model: 'Sunmi T2 · зал', lastSeen: '2 дня назад', online: false },
]

function fmtCountdown(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function Devices() {
  const [now, setNow] = useState(Date.now())
  const [devices, setDevices] = useState(INITIAL_DEVICES)

  // Тикаем раз в секунду — код и таймер обновляются сами по 5-минутному окну
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const code = currentPairingCode(now)
  const remaining = msUntilNextWindow(now)
  const pct = (remaining / PAIRING_WINDOW_MS) * 100

  const disconnect = (id) => setDevices((d) => d.filter((x) => x.id !== id))

  return (
    <>
      <PageHead
        crumbs="Устройства"
        title="Устройства"
        sub="Подключённые POS-терминалы филиала и одноразовый код для подключения новых."
      />

      <div className="grid grid-2" style={{ alignItems: 'start', marginBottom: 16 }}>
        <Card title="Код подключения POS">
          <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
            <div className="small muted" style={{ letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
              Код подтверждения
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 6, fontFamily: 'monospace', color: 'var(--violet)', lineHeight: 1 }}>
              {code.slice(0, 3)} {code.slice(3)}
            </div>
            <div style={{ height: 6, background: 'var(--bg-soft, #F1F2F5)', borderRadius: 999, overflow: 'hidden', maxWidth: 280, margin: '16px auto 8px' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--violet)', borderRadius: 999, transition: 'width 1s linear' }} />
            </div>
            <div className="small muted">Обновится через {fmtCountdown(remaining)} · меняется каждые 5 минут</div>
          </div>
          <div className="note small" style={{ marginTop: 10 }}>
            Введите этот код на POS-терминале при подключении. Код действует только в текущем 5-минутном окне.
          </div>
        </Card>

        <Card title="Как подключить терминал">
          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>На POS-терминале откройте экран «Подключение терминала».</li>
            <li>Введите 6-значный код из этого окна.</li>
            <li>Устройство появится в списке ниже и будет привязано к филиалу.</li>
          </ol>
          <div className="note small" style={{ marginTop: 12 }}>
            Логин и пароль для терминала не нужны — только код подтверждения, как в Google Authenticator.
          </div>
        </Card>
      </div>

      <Card title={`Подключённые устройства (${devices.length})`} pad={false}>
        <Table
          columns={[
            { label: 'Устройство' },
            { label: 'Модель' },
            { label: 'Последняя активность' },
            { label: 'Статус' },
            { label: '' },
          ]}
          rows={devices}
          renderRow={(d) => (
            <tr key={d.id}>
              <td style={{ fontWeight: 600 }}>{d.name}</td>
              <td><span className="small muted">{d.model}</span></td>
              <td><span className="small">{d.lastSeen}</span></td>
              <td><Badge color={d.online ? 'green' : 'gray'}>{d.online ? 'Онлайн' : 'Не в сети'}</Badge></td>
              <td>
                <Button size="sm" variant="ghost" onClick={() => disconnect(d.id)} title="Отключить">
                  <IcTrash size={14} /> Отключить
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>
    </>
  )
}
