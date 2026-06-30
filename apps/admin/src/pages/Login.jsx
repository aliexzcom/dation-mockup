import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Field, Input, Button } from '../components/ui.jsx'
import { formatUzbPhone, isUzbPhoneValid } from '../components/phone.js'

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [pass, setPass] = useState('')

  const valid = isUzbPhoneValid(phone) && pass.length >= 1

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    navigate('/business/branches')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-soft)', padding: 20 }}>
      <form onSubmit={submit} className="card" style={{ width: 400, maxWidth: '100%', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center', marginBottom: 8 }}>
          <div className="brand-mark" style={{ width: 36, height: 36 }}><img src="/logo-mark.svg" alt="Dation" /></div>
          <span style={{ fontWeight: 700, fontSize: 22 }}>Dation</span>
        </div>
        <p className="muted" style={{ textAlign: 'center', marginTop: 0, marginBottom: 24 }}>
          Вход по номеру телефона и паролю
        </p>

        <Field label="Номер телефона">
          <Input type="tel" placeholder="+998 90 123 45 67" value={phone} onChange={(e) => setPhone(formatUzbPhone(e.target.value))} autoFocus />
        </Field>
        <Field label="Пароль">
          <Input type="password" placeholder="Введите пароль" value={pass} onChange={(e) => setPass(e.target.value)} />
        </Field>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
          <Link to="/login" className="small" style={{ color: 'var(--violet)' }}>Забыли пароль?</Link>
        </div>

        <Button type="submit" className="block" disabled={!valid}>Войти</Button>

        <div className="divider" />
        <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
          Нет аккаунта?{' '}
          <Link to="/onboarding" style={{ color: 'var(--violet)', fontWeight: 600 }}>Зарегистрировать компанию</Link>
        </p>
      </form>
    </div>
  )
}
