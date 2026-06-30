import { useNavigate } from 'react-router-dom'
import { Frame } from '../components/ui.jsx'
import { IcStar } from '../icons.jsx'
import { REVIEWS } from '../data.js'

export default function Reviews() {
  const navigate = useNavigate()
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)

  return (
    <Frame title="Отзывы" onBack={() => navigate(-1)}>
      <div className="pad">
        <div className="rev-summary">
          <div className="rev-avg">{avg}</div>
          <div>
            <div className="rev-avg-stars">
              {Array.from({ length: 5 }).map((_, j) => (
                <IcStar key={j} size={16} style={{ opacity: j < Math.round(avg) ? 1 : 0.22 }} />
              ))}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>{REVIEWS.length} отзывов</div>
          </div>
        </div>

        {REVIEWS.map((r) => (
          <div key={r.id} className="rev-card">
            <div className="rev-head">
              <div className="rev-name">{r.name}</div>
              <div className="rev-date">{r.date}</div>
            </div>
            <div className="rc-stars" style={{ margin: '4px 0 6px' }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <IcStar key={j} size={13} style={{ opacity: j < r.rating ? 1 : 0.22 }} />
              ))}
            </div>
            <div className="rev-text">{r.text}</div>
          </div>
        ))}
      </div>
    </Frame>
  )
}
