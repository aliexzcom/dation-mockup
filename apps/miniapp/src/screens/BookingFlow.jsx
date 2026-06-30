import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Frame, Steps, Tick, Stars, Ava, ThemeBtn } from '../components/ui.jsx'
import { DateTimePicker } from '../components/DateTime.jsx'
import {
  IcPin, IcCheck, IcUser, IcCard, IcCash, IcWallet, IcInfo,
} from '../icons.jsx'
import {
  COMPANY, CLIENT, BRANCHES, CATEGORIES, STAFF, PREPAY_AMOUNT,
  fmtPrice, fmtDur, fmtDateFull,
} from '../data.js'
import { formatUzbPhone, isUzbPhoneValid } from '../phone.js'

const STEP_TITLES = ['Филиал', 'Услуги', 'Мастер', 'Дата и время', 'Контакты', 'Депозит']

export default function BookingFlow({ theme }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [branch, setBranch] = useState(null)
  const [services, setServices] = useState([])   // массив объектов услуг
  const [master, setMaster] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [name, setName] = useState(CLIENT.name)
  const [phone, setPhone] = useState(CLIENT.phone)
  const [comment, setComment] = useState('')
  const [payMethod, setPayMethod] = useState('payme')

  const total = useMemo(() => services.reduce((s, x) => s + x.price, 0), [services])
  const totalDur = useMemo(() => services.reduce((s, x) => s + x.dur, 0), [services])
  const selectedIds = services.map((s) => s.id)

  function toggleService(svc) {
    setServices((prev) =>
      prev.some((s) => s.id === svc.id) ? prev.filter((s) => s.id !== svc.id) : [...prev, svc]
    )
    // при смене услуг сбрасываем мастера, если он больше не оказывает выбранное
    setMaster(null)
  }

  const back = () => setStep((s) => Math.max(0, s - 1))
  const next = () => setStep((s) => s + 1)

  // Мастера, подходящие под выбранные услуги
  const masters = useMemo(() => {
    if (!selectedIds.length) return STAFF
    return STAFF.filter((m) => m.any || m.services?.some((sid) => selectedIds.includes(sid)))
  }, [selectedIds])

  // ----- Экран успеха -----
  if (step === 6) {
    return (
      <Frame title="Готово" subtitle={COMPANY.name} right={<ThemeBtn theme={theme} />}>
        <div className="pad center">
          <div className="success-ico"><IcCheck size={42} /></div>
          <h2 className="h-screen">Вы записаны!</h2>
          <p className="h-sub">Детали записи отправлены вам в Telegram. Напомним за день и за час до визита.</p>

          <div className="summary" style={{ textAlign: 'left' }}>
            <div className="kv"><span className="k">Услуги</span><span className="v">{services.map((s) => s.name).join(', ')}</span></div>
            <div className="kv"><span className="k">Мастер</span><span className="v">{master?.name}</span></div>
            <div className="kv"><span className="k">Когда</span><span className="v">{fmtDateFull(date)}, {time} · {fmtDur(totalDur)}</span></div>
            <div className="kv"><span className="k">Филиал</span><span className="v">{branch?.name}</span></div>
            <div className="kv total"><span className="k">Итого</span><span className="v">{fmtPrice(total)}</span></div>
          </div>

          <div style={{ marginTop: 18 }}>
            <button className="btn" onClick={() => navigate('/my')}>Мои записи</button>
            <div className="bcard-actions" style={{ marginTop: 10 }}>
              <button className="btn secondary" onClick={() => setStep(3)}>Перенести</button>
              <button className="btn danger" onClick={() => navigate('/')}>Отменить</button>
            </div>
          </div>
        </div>
      </Frame>
    )
  }

  // ----- Текущий шаг -----
  return (
    <Frame
      title="Онлайн-запись"
      subtitle={`${STEP_TITLES[step]} · шаг ${step + 1} из 6`}
      onBack={step > 0 ? back : () => navigate('/')}
      right={<ThemeBtn theme={theme} />}
      scrollKey={step}
      footer={renderFooter()}
    >
      <Steps total={6} current={step} />
      <div className="pad">{renderStep()}</div>
    </Frame>
  )

  function renderStep() {
    if (step === 0) return (
      <>
        <h2 className="h-screen">Выберите филиал</h2>
        <p className="h-sub">{COMPANY.name}</p>
        {BRANCHES.map((b) => (
          <button key={b.id} className={'pick' + (branch?.id === b.id ? ' sel' : '')} onClick={() => setBranch(b)}>
            <Ava><IcPin /></Ava>
            <div className="pick-body">
              <div className="pick-title">{b.name}</div>
              <div className="pick-meta">{b.addr} · {b.hours}</div>
            </div>
            <Tick on={branch?.id === b.id} />
          </button>
        ))}
      </>
    )

    if (step === 1) return (
      <>
        <h2 className="h-screen">Какие услуги?</h2>
        <p className="h-sub">Можно выбрать несколько</p>
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div className="sec-title">{cat.name}</div>
            {cat.services.map((svc) => {
              const on = selectedIds.includes(svc.id)
              return (
                <button key={svc.id} className={'pick' + (on ? ' sel' : '')} onClick={() => toggleService(svc)}>
                  <Tick on={on} />
                  <div className="pick-body">
                    <div className="pick-title">{svc.name}</div>
                    <div className="pick-meta">{svc.desc}</div>
                  </div>
                  <div className="pick-right">
                    <div className="pick-price">{fmtPrice(svc.price)}</div>
                    <div className="pick-dur">{fmtDur(svc.dur)}</div>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </>
    )

    if (step === 2) return (
      <>
        <h2 className="h-screen">Выберите мастера</h2>
        <p className="h-sub">Показаны мастера по выбранным услугам</p>
        {masters.map((m) => (
          <button key={m.id} className={'pick' + (master?.id === m.id ? ' sel' : '')} onClick={() => setMaster(m)}>
            <Ava className="round">{m.any ? <IcUser /> : m.initials}</Ava>
            <div className="pick-body">
              <div className="pick-title">{m.name}</div>
              <div className="pick-meta">{m.spec}</div>
            </div>
            <div className="pick-right">
              {!m.any && <Stars value={m.rating} />}
              <div style={{ marginTop: 6 }}><Tick on={master?.id === m.id} /></div>
            </div>
          </button>
        ))}
      </>
    )

    if (step === 3) return (
      <>
        <h2 className="h-screen">Дата и время</h2>
        <p className="h-sub">Свободные слоты {master?.any ? '' : `мастера ${master?.name}`}</p>
        <DateTimePicker date={date} time={time}
          onDate={(k) => { setDate(k); setTime(null) }} onTime={setTime} />
      </>
    )

    if (step === 4) return (
      <>
        <h2 className="h-screen">Ваши контакты</h2>
        <p className="h-sub">Подтянуты из Telegram — можно изменить</p>
        <div className="field">
          <label>Имя</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" />
        </div>
        <div className="field">
          <label>Телефон</label>
          <input className="input" value={phone} inputMode="tel"
            onChange={(e) => setPhone(formatUzbPhone(e.target.value))} placeholder="+998 90 123 45 67" />
          {!isUzbPhoneValid(phone) && phone.replace(/\D/g, '').length > 3 &&
            <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>Введите номер полностью</div>}
        </div>
        <div className="field">
          <label>Комментарий <span className="muted">(необязательно)</span></label>
          <textarea className="input" value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Пожелания к визиту" />
        </div>
        <div className="note"><IcInfo size={15} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Нажимая «К депозиту», вы соглашаетесь с офертой и обработкой персональных данных.</div>
      </>
    )

    // step 5 — депозит
    return (
      <>
        <h2 className="h-screen">Предоплата депозита</h2>
        <p className="h-sub">Депозит закрепляет за вами время и вычитается из суммы визита</p>

        <div className="summary">
          <div className="kv"><span className="k">Визит</span><span className="v">{fmtDateFull(date)}, {time}</span></div>
          <div className="kv"><span className="k">Сумма услуг</span><span className="v">{fmtPrice(total)}</span></div>
          <div className="kv total"><span className="k">Депозит сейчас</span><span className="v">{fmtPrice(PREPAY_AMOUNT)}</span></div>
        </div>

        <div className="sec-title">Способ оплаты</div>
        <button className={'pick' + (payMethod === 'payme' ? ' sel' : '')} onClick={() => setPayMethod('payme')}>
          <Ava><IcWallet /></Ava>
          <div className="pick-body">
            <div className="pick-title">Payme</div>
            <div className="pick-meta">Оплата через Payme</div>
          </div>
          <Tick on={payMethod === 'payme'} />
        </button>
        <button className={'pick' + (payMethod === 'click' ? ' sel' : '')} onClick={() => setPayMethod('click')}>
          <Ava><IcWallet /></Ava>
          <div className="pick-body">
            <div className="pick-title">Click</div>
            <div className="pick-meta">Оплата через Click</div>
          </div>
          <Tick on={payMethod === 'click'} />
        </button>
        <button className={'pick' + (payMethod === 'card' ? ' sel' : '')} onClick={() => setPayMethod('card')}>
          <Ava><IcCard /></Ava>
          <div className="pick-body">
            <div className="pick-title">Банковская карта</div>
            <div className="pick-meta">UZCARD · Visa</div>
          </div>
          <Tick on={payMethod === 'card'} />
        </button>

        <button className="btn ghost" style={{ marginTop: 8 }} onClick={next}>
          <IcCash size={18} /> Оплатить на месте
        </button>
      </>
    )
  }

  function renderFooter() {
    if (step === 0) return <button className="btn" disabled={!branch} onClick={next}>Продолжить</button>
    if (step === 1) return (
      <button className="btn" disabled={!services.length} onClick={next}>
        {services.length ? `Продолжить · ${fmtPrice(total)}` : 'Выберите услугу'}
      </button>
    )
    if (step === 2) return <button className="btn" disabled={!master} onClick={next}>Продолжить</button>
    if (step === 3) return (
      <button className="btn" disabled={!date || !time} onClick={next}>
        {date && time ? `Продолжить · ${time}` : 'Выберите время'}
      </button>
    )
    if (step === 4) return (
      <button className="btn" disabled={!name.trim() || !isUzbPhoneValid(phone)} onClick={next}>К депозиту</button>
    )
    return <button className="btn" onClick={next}>Оплатить {fmtPrice(PREPAY_AMOUNT)} и записаться</button>
  }
}
