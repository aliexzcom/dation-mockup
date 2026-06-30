import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Frame, ThemeBtn } from '../components/ui.jsx'
import { IcChevR, IcPlusCal, IcBack, IcStar } from '../icons.jsx'
import { COMPANY, CLIENT, BANNERS, REVIEWS, WORK_PHOTOS } from '../data.js'

// «Косичка»: 2 колонки, отзыв и фото в шахматном порядке
const BRAID = Array.from({ length: 8 }, (_, i) => {
  const row = Math.floor(i / 2)
  const col = i % 2
  return (row + col) % 2 === 0
    ? { type: 'review', ...REVIEWS[row % REVIEWS.length] }
    : { type: 'photo', src: WORK_PHOTOS[row % WORK_PHOTOS.length] }
})

export default function Home({ theme }) {
  const navigate = useNavigate()
  const stripRef = useRef(null)
  const [active, setActive] = useState(0)

  // Шаг прокрутки = ширина карточки + зазор
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

  // Листание афиш стрелками (с заворачиванием по кругу)
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
      subtitle={COMPANY.about}
      onMenu={() => navigate('/menu')}
      right={<ThemeBtn theme={theme} />}
    >
      <div className="greet">
        <div className="hi">Здравствуйте, {CLIENT.name.split(' ')[0]}</div>
        <div className="co">Записывайтесь онлайн за пару касаний</div>
      </div>

      <div className="promo-wrap">
        <div className="promo-strip" ref={stripRef} onScroll={onStripScroll}>
          {BANNERS.map((b) => (
            <div key={b.id} className="promo" style={{ background: b.grad }} onClick={() => navigate('/booking')}>
              <span className="promo-badge">{b.badge}</span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="promo-arrow promo-arrow-l" onClick={() => scrollByDir(-1)} aria-label="Предыдущая афиша">
          <IcBack size={18} />
        </button>
        <button type="button" className="promo-arrow promo-arrow-r" onClick={() => scrollByDir(1)} aria-label="Следующая афиша">
          <IcChevR size={18} />
        </button>
      </div>
      <div className="promo-dots">
        {BANNERS.map((b, i) => (
          <span key={b.id} className={'promo-dot' + (i === active ? ' active' : '')} />
        ))}
      </div>

      <div className="quick-cta">
        <button className="btn" onClick={() => navigate('/booking')}>
          <IcPlusCal size={18} /> Записаться онлайн
        </button>
      </div>

      <div className="pad" style={{ paddingTop: 8 }}>
        <div className="sec-title">Отзывы и работы</div>
        <div className="braid">
          {BRAID.map((cell, i) => (cell.type === 'review' ? (
            <div key={i} className="braid-cell review-cell">
              <div className="rc-stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <IcStar key={j} size={13} style={{ opacity: j < cell.rating ? 1 : 0.22 }} />
                ))}
              </div>
              <div className="rc-text">{cell.text}</div>
              <div className="rc-name">{cell.name}</div>
            </div>
          ) : (
            <div key={i} className="braid-cell photo-cell" style={{ backgroundImage: `url(${cell.src})` }} role="img" aria-label="Фото работы" />
          )))}
        </div>
        <button className="btn secondary" style={{ width: '100%', marginTop: 12 }} onClick={() => navigate('/reviews')}>
          Читать все отзывы <IcChevR size={16} />
        </button>
      </div>
    </Frame>
  )
}
