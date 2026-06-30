import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ui.jsx'
import { IcPhone, IcLock } from '../icons.jsx'
import { COMPANY } from '../data.js'
import { formatUzbPhone, isUzbPhoneValid } from '../phone.js'

export default function Login({ theme, onAuth }) {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('+998 90 123 45 67')
  const [pass, setPass] = useState('')

  const canSubmit = isUzbPhoneValid(phone) && pass.length >= 4

  const submit = () => {
    if (!canSubmit) return
    onAuth()
    navigate('/staff')
  }

  return (
    <div className="full">
      <div style={{ position: 'fixed', top: 18, right: 18 }}><ThemeToggle theme={theme} /></div>

      <div className="brand-row">
        <div className="brand-mark">{COMPANY.short}</div>
        <div className="brand-name">Dation POS<span>{COMPANY.name}</span></div>
      </div>

      <div className="auth-card">
        <h2>Вход в терминал</h2>
        <div className="sub">Авторизуйтесь по номеру и паролю</div>

        <div className="field">
          <label>Номер телефона</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-faint)' }}><IcPhone size={18} /></span>
            <input className="input" style={{ paddingLeft: 42 }} value={phone} inputMode="tel"
              onChange={(e) => setPhone(formatUzbPhone(e.target.value))} placeholder="+998 90 123 45 67" />
          </div>
        </div>

        <div className="field">
          <label>Пароль</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-faint)' }}><IcLock size={18} /></span>
            <input className="input" style={{ paddingLeft: 42 }} type="password" value={pass}
              onChange={(e) => setPass(e.target.value)} placeholder="Введите пароль"
              onKeyDown={(e) => e.key === 'Enter' && submit()} />
          </div>
        </div>

        <button className="btn lg block" disabled={!canSubmit} onClick={submit}>Войти</button>
        <div className="note" style={{ marginTop: 16 }}>Демо: введите любой пароль от 4 символов.</div>
      </div>
    </div>
  )
}
