import { useState } from 'react'
import { IcBackspace } from '../icons.jsx'

// PIN-пад в двух режимах:
// 1) expectedPin + onSuccess — сверяет ввод с ожидаемым PIN (выбор сотрудника);
// 2) length + onComplete(code) — свободный ввод; родитель решает, верен ли код
//    (onComplete возвращает true/false). На успехе родитель сам переходит дальше.
export default function PinPad({ expectedPin, length, onSuccess, onComplete, reveal }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const len = expectedPin ? expectedPin.length : (length || 4)

  const press = (d) => {
    if (pin.length >= len) return
    const np = pin + d
    setPin(np)
    if (np.length === len) {
      const fail = () => { setErr(true); setTimeout(() => { setErr(false); setPin('') }, 520) }
      if (onComplete) {
        // на успехе родитель навигэйтит (экран размонтируется) — стейт не трогаем
        if (onComplete(np) === false) fail()
      } else if (np === expectedPin) {
        setTimeout(onSuccess, 130)
      } else {
        fail()
      }
    }
  }
  const back = () => setPin((p) => p.slice(0, -1))

  return (
    <div className="pin-wrap">
      {reveal ? (
        <div className="code-cells">
          {Array.from({ length: len }).map((_, i) => (
            <div key={i} className={'code-cell' + (i === pin.length ? ' active' : '') + (err ? ' err' : '')}>{pin[i] || ''}</div>
          ))}
        </div>
      ) : (
        <div className="pin-dots">
          {Array.from({ length: len }).map((_, i) => (
            <div key={i} className={'pin-dot' + (i < pin.length ? ' on' : '') + (err ? ' err' : '')} />
          ))}
        </div>
      )}
      {reveal && <div className="code-sep" />}
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
