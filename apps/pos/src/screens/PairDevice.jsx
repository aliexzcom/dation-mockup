import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ui.jsx'
import PinPad from '../components/PinPad.jsx'
import { COMPANY } from '../data.js'
import { currentPairingCode, isPairingCodeValid } from '../pairing.js'

// Подключение терминала по 4-значному коду из веб-кабинета
// (Филиал → Устройства). Код меняется каждые 5 минут.
export default function PairDevice({ theme, onAuth }) {
  const navigate = useNavigate()
  const [demo, setDemo] = useState(currentPairingCode())

  // Подсказка с актуальным кодом обновляется при смене окна
  useEffect(() => {
    const id = setInterval(() => setDemo(currentPairingCode()), 1000)
    return () => clearInterval(id)
  }, [])

  const tryCode = (code) => {
    if (!isPairingCodeValid(code)) return false
    onAuth()
    navigate('/staff')
    return true
  }

  return (
    <div className="full">
      <div style={{ position: 'fixed', top: 18, right: 18 }}><ThemeToggle theme={theme} /></div>

      <div className="brand-row">
        <div className="brand-mark"><img src="/logo-mark.svg" alt="Dation" /></div>
        <div className="brand-name">Dation POS<span>{COMPANY.name}</span></div>
      </div>

      <div className="auth-card">
        <h2>Подключение терминала</h2>
        <div className="sub">Введите код подтверждения из веб-кабинета: Филиал → Устройства</div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PinPad length={6} reveal onComplete={tryCode} />
        </div>

        <div className="note" style={{ marginTop: 18, textAlign: 'center' }}>
          Код обновляется каждые 5 минут. Демо-код сейчас: <b>{demo}</b>
        </div>
      </div>
    </div>
  )
}
