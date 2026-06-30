import { useRef } from 'react'

// Ввод кода подтверждения: N отдельных ячеек с автопереходом
export function OtpInput({ length = 4, value, onChange }) {
  const refs = useRef([])

  const setDigit = (i, v) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const arr = value.padEnd(length).split('')
    arr[i] = digit || ' '
    const next = arr.join('').replace(/\s+$/, '')
    onChange(next.slice(0, length))
    if (digit && i < length - 1) refs.current[i + 1]?.focus()
  }

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          className="otp-cell"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
        />
      ))}
    </div>
  )
}
