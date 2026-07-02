import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Frame } from '../components/ui.jsx'
import { IcChevR, IcBack, IcStar, IcUser, IcScissors, IcClock, IcArrowUpRight } from '../icons.jsx'
import {
  COMPANY, CLIENT, BRANCHES, BANNERS, STAFF,
  fmtPrice, fmtDateShort, fmtRating,
} from '../data.js'
import {
  BranchSheet, SpecialistSheet, ServicesSheet, DateTimeSheet, ConfirmSheet, SuccessSheet,
} from './BookingSheets.jsx'

const REAL_MASTERS = STAFF.filter((m) => !m.any)

// Шаги записи: порядок, подписи «к следующему шагу» и подсказки
const STEP_ORDER = ['specialist', 'services', 'datetime']
const STEP_LABEL = { specialist: 'Выбрать специалиста', services: 'Выбрать услуги', datetime: 'Выбрать дату и время' }
const STEP_PROMPT = { specialist: 'Выберите специалиста', services: 'Выберите услугу', datetime: 'Выберите время' }

export default function Home() {
  const navigate = useNavigate()
  const stripRef = useRef(null)
  const [active, setActive] = useState(0)

  // Черновик записи (параллельный выбор)
  const [branch, setBranch] = useState(BRANCHES[0])
  const [master, setMaster] = useState(null)
  const [services, setServices] = useState([])
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [sheet, setSheet] = useState(null) // 'branch'|'specialist'|'services'|'datetime'|'confirm'|'success'

  const total = services.reduce((s, x) => s + x.price, 0)
  const ready = master && services.length && date && time

  // Футер шторки ведёт к следующему невыбранному шагу (а когда всё выбрано — «Записаться»)
  const stepDone = { specialist: !!master, services: services.length > 0, datetime: !!(date && time) }
  const sheetFooter = (cur) => {
    if (!stepDone[cur]) return <button className="btn" disabled>{STEP_PROMPT[cur]}</button>
    const nextK = STEP_ORDER.find((k) => k !== cur && !stepDone[k])
    if (nextK) return <button className="btn" onClick={() => setSheet(nextK)}>{STEP_LABEL[nextK]}</button>
    return <button className="btn" onClick={() => setSheet('confirm')}>Записаться</button>
  }

  const toggleService = (svc) => {
    setServices((prev) => (prev.some((s) => s.id === svc.id) ? prev.filter((s) => s.id !== svc.id) : [...prev, svc]))
    if (master && !master.any && !master.services?.includes(svc.id)) setMaster(null)
  }

  const resetDraft = () => { setMaster(null); setServices([]); setDate(null); setTime(null) }

  // Шаг прокрутки афиш = ширина карточки + зазор
  const cardStep = () => {
    const el = stripRef.current
    const first = el?.firstElementChild
    return first ? first.offsetWidth + 12 : 302
  }

  // Автолистание афиш (пауза при наведении/касании)
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    let paused = false
    const pause = () => { paused = true }
    const resume = () => { paused = false }
    el.addEventListener('pointerdown', pause)
    el.addEventListener('pointerenter', pause)
    el.addEventListener('pointerleave', resume)
    el.addEventListener('pointerup', resume)

    const id = setInterval(() => {
      if (paused) return
      const step = cardStep()
      let next = Math.round(el.scrollLeft / step) + 1
      if (next * step >= el.scrollWidth - el.clientWidth + step / 2) next = 0
      el.scrollTo({ left: next * step, behavior: 'smooth' })
    }, 3500)

    return () => {
      clearInterval(id)
      el.removeEventListener('pointerdown', pause)
      el.removeEventListener('pointerenter', pause)
      el.removeEventListener('pointerleave', resume)
      el.removeEventListener('pointerup', resume)
    }
  }, [])

  const onStripScroll = () => {
    const el = stripRef.current
    if (el) setActive(Math.round(el.scrollLeft / cardStep()))
  }

  const scrollByDir = (dir) => {
    const el = stripRef.current
    if (!el) return
    const step = cardStep()
    const last = BANNERS.length - 1
    let next = Math.round(el.scrollLeft / step) + dir
    if (next < 0) next = last
    if (next > last) next = 0
    el.scrollTo({ left: next * step, behavior: 'smooth' })
  }

  return (
    <Frame
      title={COMPANY.name}
      onMenu={() => navigate('/menu')}
      footer={
        <button className="btn" disabled={!ready} onClick={() => setSheet('confirm')}>
          {ready ? `Записаться · ${fmtPrice(total)}` : 'Выберите специалиста, услуги и время'}
        </button>
      }
    >
      {/* Карточка филиала */}
      <div className="pad" style={{ paddingBottom: 4 }}>
        <button className="filial" onClick={() => setSheet('branch')}>
          <div className="filial-logo"><img src="/logo-mark.svg" alt="" /></div>
          <div className="filial-body">
            <div className="filial-label">Филиал</div>
            <div className="filial-name">{branch.name} <IcChevR size={15} style={{ transform: 'rotate(90deg)' }} /></div>
          </div>
          <div className="filial-ava">{CLIENT.initials}</div>
        </button>
      </div>

      {/* Афиши */}
      <div className="promo-wrap">
        <div className="promo-strip" ref={stripRef} onScroll={onStripScroll}>
          {BANNERS.map((b) => (
            <div key={b.id} className="promo" style={{ background: b.grad }} onClick={() => setSheet('services')}>
              <span className="promo-badge">{b.badge}</span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="promo-arrow promo-arrow-l" onClick={() => scrollByDir(-1)} aria-label="Предыдущая афиша"><IcBack size={18} /></button>
        <button type="button" className="promo-arrow promo-arrow-r" onClick={() => scrollByDir(1)} aria-label="Следующая афиша"><IcChevR size={18} /></button>
      </div>
      <div className="promo-dots">
        {BANNERS.map((b, i) => <span key={b.id} className={'promo-dot' + (i === active ? ' active' : '')} />)}
      </div>

      {/* Запись по расписанию — 3 карточки */}
      <div className="pad" style={{ paddingTop: 10, paddingBottom: 4 }}>
        <div className="sec-title" style={{ marginTop: 4 }}>Запись по расписанию</div>
        <div className="qa-grid">
          <button className="qa" onClick={() => setSheet('specialist')}>
            <span className="qa-ico"><IcUser size={20} /></span>
            <span className="qa-arr"><IcArrowUpRight size={15} /></span>
            <span className="qa-label">Выбрать специалиста</span>
            <span className="qa-val">{master ? master.name : ' '}</span>
          </button>
          <button className="qa" onClick={() => setSheet('services')}>
            <span className="qa-ico"><IcScissors size={20} /></span>
            <span className="qa-arr"><IcArrowUpRight size={15} /></span>
            <span className="qa-label">Выбрать услуги</span>
            <span className="qa-val">{services.length > 0 ? `${services.length} · ${fmtPrice(total)}` : ' '}</span>
          </button>
          <button className="qa" onClick={() => setSheet('datetime')}>
            <span className="qa-ico"><IcClock size={20} /></span>
            <span className="qa-arr"><IcArrowUpRight size={15} /></span>
            <span className="qa-label">Выбрать дату и время</span>
            <span className="qa-val">{date && time ? `${fmtDateShort(date)}, ${time}` : ' '}</span>
          </button>
        </div>
      </div>

      {/* Мастера */}
      <div className="pad" style={{ paddingTop: 8 }}>
        <div className="sec-row">
          <div className="sec-title" style={{ margin: 0 }}>Мастера</div>
          <span className="sec-count">{REAL_MASTERS.length}</span>
        </div>
        <div className="master-strip">
          {REAL_MASTERS.map((m) => (
            <button key={m.id} className={'master-card' + (master?.id === m.id ? ' sel' : '')} onClick={() => { setMaster(m); setSheet('services') }}>
              <div className="master-photo" style={{ backgroundImage: `url(${m.photo})` }} />
              <div className="master-name">{m.name}</div>
              <div className="master-role">{m.spec}</div>
              <div className="master-rate"><IcStar size={12} /> {fmtRating(m.rating)} · {m.reviews}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Шторки */}
      {sheet === 'branch' && <BranchSheet branch={branch} onPick={setBranch} onClose={() => setSheet(null)} />}
      {sheet === 'specialist' && <SpecialistSheet master={master} services={services} onPick={setMaster} onClose={() => setSheet(null)} footer={sheetFooter('specialist')} />}
      {sheet === 'services' && <ServicesSheet master={master} services={services} onToggle={toggleService} onClose={() => setSheet(null)} footer={sheetFooter('services')} />}
      {sheet === 'datetime' && <DateTimeSheet date={date} time={time} onDate={setDate} onTime={setTime} onClose={() => setSheet(null)} footer={sheetFooter('datetime')} />}
      {sheet === 'confirm' && (
        <ConfirmSheet
          services={services} master={master} date={date} time={time}
          onClose={() => setSheet(null)} onDone={() => setSheet('success')}
        />
      )}
      {sheet === 'success' && (
        <SuccessSheet
          services={services} master={master} branch={branch} date={date} time={time}
          onMy={() => navigate('/my')} onClose={() => { setSheet(null); resetDraft() }}
        />
      )}
    </Frame>
  )
}
