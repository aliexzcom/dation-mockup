import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Field, Input, Button } from '../components/ui.jsx'
import { OtpInput } from '../components/OtpInput.jsx'
import { formatUzbPhone, isUzbPhoneValid } from '../components/phone.js'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone') // 'phone' | 'code'
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')

  const phoneValid = isUzbPhoneValid(phone)
  const codeValid = code.length === 4

  const sendCode = (e) => {
    e.preventDefault()
    if (!phoneValid) return
    setStep('code')
  }

  const confirm = (e) => {
    e.preventDefault()
    if (!codeValid) return
    navigate('/business/branches')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-soft)', padding: 20 }}>
      <form onSubmit={step === 'phone' ? sendCode : confirm} className="card" style={{ width: 400, maxWidth: '100%', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center', marginBottom: 8 }}>
          <div className="brand-mark" style={{ width: 36, height: 36, fontSize: 18 }}>D</div>
          <span style={{ fontWeight: 700, fontSize: 22 }}>Dation</span>
        </div>
        <p className="muted" style={{ textAlign: 'center', marginTop: 0, marginBottom: 24 }}>
          {step === 'phone' ? 'Вход по номеру телефона' : 'Подтверждение номера'}
        </p>

        {step === 'phone' ? (
          <>
            <Field label="Номер телефона">
              <Input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(formatUzbPhone(e.target.value))}
                autoFocus
              />
            </Field>
            <p className="small muted" style={{ marginTop: -4, marginBottom: 18 }}>
              На этот номер придёт код подтверждения.
            </p>
            <Button type="submit" className="block" disabled={!phoneValid}>Получить код</Button>

            <div className="divider" />
            <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
              Нет аккаунта?{' '}
              <Link to="/onboarding" style={{ color: 'var(--violet)', fontWeight: 600 }}>Зарегистрировать компанию</Link>
            </p>
          </>
        ) : (
          <>
            <p className="muted" style={{ textAlign: 'center', marginTop: 0, marginBottom: 18 }}>
              Мы отправили код подтверждения на номер<br /><strong style={{ color: 'var(--text)' }}>{phone}</strong>
            </p>
            <OtpInput length={4} value={code} onChange={setCode} />
            <div style={{ textAlign: 'center', margin: '14px 0 18px' }}>
              <span className="small muted">Не получили код? </span>
              <button type="button" className="small" style={{ background: 'none', border: 0, color: 'var(--violet)', cursor: 'pointer', fontWeight: 600 }}>Отправить повторно</button>
            </div>
            <Button type="submit" className="block" disabled={!codeValid}>Войти</Button>
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <button type="button" onClick={() => { setStep('phone'); setCode('') }} className="small" style={{ background: 'none', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }}>
                Изменить номер
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
