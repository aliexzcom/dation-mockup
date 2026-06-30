import { useState } from 'react'
import { IcBackspace } from '../icons.jsx'

// Самодостаточный PIN-пад. Сверяет ввод с expectedPin и вызывает onSuccess.
export default function PinPad({ expectedPin, onSuccess }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const len = expectedPin.length

  const press = (d) => {
    if (pin.length >= len) return
    const np = pin + d
    setPin(np)
    if (np.length === len) {
      if (np === expectedPin) {
        setTimeout(onSuccess, 130)
      } else {
        setErr(true)
        setTimeout(() => { setErr(false); setPin('') }, 520)
      }
    }
  }
  const back = () => setPin((p) => p.slice(0, -1))

  return (
    <div className="pin-wrap">
      <div className="pin-dots">
        {Array.from({ length: len }).map((_, i) => (
          <div key={i} className={'pin-dot' + (i < pin.length ? ' on' : '') + (err ? ' err' : '')} />
        ))}
      </div>
      <div className="pinpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="pin-key" onClick={() => press(String(n))}>{n}</button>
        ))}
        <button className="pin-key muted" onClick={() => setPin('')}>Сброс</button>
        <button className="pin-key" onClick={() => press('0')}>0</button>
        <button className="pin-key muted" onClick={back} aria-label="Стереть"><IcBackspace /></button>
      </div>
    </div>
  )
}
