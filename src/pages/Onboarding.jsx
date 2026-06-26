import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Field, Input, Select, Button } from '../components/ui.jsx'
import { OtpInput } from '../components/OtpInput.jsx'
import { formatUzbPhone, isUzbPhoneValid } from '../components/phone.js'

const EMPTY = {
  owner: '', phone: '',
  company: '', industry: 'Салон красоты / барбершоп',
  services: [], staffCount: '1–3', branchCount: '1',
  plan: 'Бизнес',
}

const SERVICE_OPTIONS = [
  'Стрижки', 'Окрашивание', 'Барбершоп', 'Маникюр', 'Педикюр',
  'Брови и ресницы', 'Косметология', 'Массаж', 'Депиляция',
  'Макияж', 'SPA', 'Стоматология', 'Фитнес', 'Другое',
]

// Регистрация по номеру + опрос о компании (само-регистрация, онбординг — Этап 4 ТЗ)
export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 — номер, 2 — код, 3 — опрос, 4 — тариф
  const [form, setForm] = useState(EMPTY)
  const [code, setCode] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleService = (s) =>
    setForm((f) => ({ ...f, services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s] }))

  const phoneValid = isUzbPhoneValid(form.phone)
  const step1Valid = form.owner.trim() && phoneValid
  const codeValid = code.length === 4
  const surveyValid = form.company.trim() && form.services.length > 0

  const finish = () => navigate('/business/branches')

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-soft)', padding: 20 }}>
      <div className="card" style={{ width: 540, maxWidth: '100%', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center', marginBottom: 6 }}>
          <div className="brand-mark" style={{ width: 36, height: 36, fontSize: 18 }}>D</div>
          <span style={{ fontWeight: 700, fontSize: 22 }}>Dation</span>
        </div>
        <p className="muted" style={{ textAlign: 'center', marginTop: 0, marginBottom: 20 }}>
          Регистрация — шаг {step} из 4
        </p>

        {/* индикатор шагов */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= step ? 'var(--violet)' : 'var(--border)' }} />
          ))}
        </div>

        {/* Шаг 1 — номер телефона */}
        {step === 1 && (
          <>
            <Field label="Имя владельца">
              <Input placeholder="Ваше имя" value={form.owner} onChange={(e) => set('owner', e.target.value)} />
            </Field>
            <Field label="Номер телефона">
              <Input type="tel" placeholder="+998 90 123 45 67" value={form.phone} onChange={(e) => set('phone', formatUzbPhone(e.target.value))} />
            </Field>
            <p className="small muted" style={{ marginTop: -4 }}>На этот номер придёт код подтверждения, он же станет логином для входа.</p>
            <Button className="block" style={{ marginTop: 12 }} onClick={() => setStep(2)} disabled={!step1Valid}>Получить код</Button>
          </>
        )}

        {/* Шаг 2 — подтверждение кода */}
        {step === 2 && (
          <>
            <p className="muted" style={{ textAlign: 'center', marginTop: 0, marginBottom: 18 }}>
              Мы отправили код подтверждения на номер<br /><strong style={{ color: 'var(--text)' }}>{form.phone}</strong>
            </p>
            <OtpInput length={4} value={code} onChange={setCode} />
            <div style={{ textAlign: 'center', margin: '14px 0 18px' }}>
              <span className="small muted">Не получили код? </span>
              <button type="button" className="small" style={{ background: 'none', border: 0, color: 'var(--violet)', cursor: 'pointer', fontWeight: 600 }}>Отправить повторно</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" onClick={() => { setStep(1); setCode('') }}>Назад</Button>
              <Button className="block" onClick={() => setStep(3)} disabled={!codeValid}>Подтвердить</Button>
            </div>
          </>
        )}

        {/* Шаг 3 — опрос о компании */}
        {step === 3 && (
          <>
            <p className="muted" style={{ textAlign: 'center', marginTop: 0, marginBottom: 20 }}>
              Расскажите о компании — это поможет настроить рабочее пространство.
            </p>
            <Field label="Название компании">
              <Input placeholder="Например: Beauty Studio «Аура»" value={form.company} onChange={(e) => set('company', e.target.value)} autoFocus />
            </Field>
            <Field label="Сфера деятельности">
              <Select
                options={['Салон красоты / барбершоп', 'Медицинская / стоматологическая клиника', 'Фитнес-студия', 'СТО / автосервис', 'Образовательный центр', 'Другое (по записи)']}
                value={form.industry} onChange={(e) => set('industry', e.target.value)}
              />
            </Field>

            <div className="field">
              <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 500 }}>
                Какие услуги оказываете? <span className="faint">(можно несколько)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SERVICE_OPTIONS.map((s) => (
                  <span key={s} className={`chip ${form.services.includes(s) ? 'active' : ''}`} onClick={() => toggleService(s)}>{s}</span>
                ))}
              </div>
            </div>

            <div className="row-fields" style={{ marginTop: 14 }}>
              <Field label="Количество сотрудников">
                <Select options={['1–3', '4–10', '11–30', 'Более 30']} value={form.staffCount} onChange={(e) => set('staffCount', e.target.value)} />
              </Field>
              <Field label="Количество филиалов">
                <Select options={['1', '2–3', '4 и более']} value={form.branchCount} onChange={(e) => set('branchCount', e.target.value)} />
              </Field>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button variant="secondary" onClick={() => setStep(2)}>Назад</Button>
              <Button className="block" onClick={() => setStep(4)} disabled={!surveyValid}>Далее</Button>
            </div>
          </>
        )}

        {/* Шаг 4 — тариф */}
        {step === 4 && (
          <>
            <div className="section-title" style={{ marginTop: 0 }}>Выберите тариф</div>
            <div className="grid" style={{ gap: 10 }}>
              {[
                { name: 'Старт', price: '0 ₽/мес', desc: '1 филиал, до 3 сотрудников' },
                { name: 'Бизнес', price: '2 900 ₽/мес', desc: '1 филиал, до 15 сотрудников, аналитика' },
                { name: 'Сеть', price: '6 900 ₽/мес', desc: 'Несколько филиалов, сводные отчёты' },
              ].map((p) => (
                <div key={p.name} onClick={() => set('plan', p.name)}
                  style={{
                    border: `1.5px solid ${form.plan === p.name ? 'var(--violet)' : 'var(--border)'}`,
                    background: form.plan === p.name ? 'var(--violet-50)' : '#fff',
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div className="small muted">{p.desc}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--violet)' }}>{p.price}</div>
                </div>
              ))}
            </div>

            <div className="note small" style={{ marginTop: 16 }}>
              После регистрации вы попадёте в рабочее пространство компании. Подключение Telegram-бота и настройка — в разделе «Telegram Mini App».
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="secondary" onClick={() => setStep(3)}>Назад</Button>
              <Button className="block" onClick={finish}>Создать аккаунт</Button>
            </div>
          </>
        )}

        <div className="divider" />
        <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
          Уже есть аккаунт?{' '}
          <Link to="/login" style={{ color: 'var(--violet)', fontWeight: 600 }}>Войти</Link>
        </p>
      </div>
    </div>
  )
}
