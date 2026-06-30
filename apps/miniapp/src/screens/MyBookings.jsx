import { useNavigate } from 'react-router-dom'
import { Frame, Ava, ThemeBtn } from '../components/ui.jsx'
import { IcCalCheck, IcPin, IcUser, IcClock } from '../icons.jsx'
import { CLIENT, MY_BOOKINGS, fmtPrice, fmtDur, fmtDateFull } from '../data.js'

const STATUS = {
  upcoming: { cls: 'violet', label: 'Предстоит' },
  done: { cls: 'green', label: 'Завершён' },
  cancelled: { cls: 'gray', label: 'Отменён' },
}

export default function MyBookings({ theme }) {
  const navigate = useNavigate()
  const upcoming = MY_BOOKINGS.filter((b) => b.status === 'upcoming')
  const history = MY_BOOKINGS.filter((b) => b.status !== 'upcoming')

  return (
    <Frame
      title="История посещений"
      subtitle={`${CLIENT.name} · ${CLIENT.tgUser}`}
      onBack={() => navigate(-1)}
      right={<ThemeBtn theme={theme} />}
    >
      <div className="pad">
        {!MY_BOOKINGS.length && (
          <div className="empty">
            <div className="ei"><IcCalCheck size={30} /></div>
            <h4>Записей пока нет</h4>
            <p className="muted">Запишитесь на услугу — она появится здесь.</p>
            <button className="btn" style={{ maxWidth: 220, margin: '14px auto 0' }} onClick={() => navigate('/booking')}>Записаться</button>
          </div>
        )}

        {upcoming.length > 0 && <div className="sec-title">Предстоящие</div>}
        {upcoming.map((b) => <BookingCard key={b.id} b={b} />)}

        {history.length > 0 && <div className="sec-title">История</div>}
        {history.map((b) => <BookingCard key={b.id} b={b} />)}
      </div>
    </Frame>
  )
}

function BookingCard({ b }) {
  const navigate = useNavigate()
  const st = STATUS[b.status]
  return (
    <div className="bcard">
      <div className="bcard-head">
        <Ava><IcCalCheck /></Ava>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pick-title">{fmtDateFull(b.date)}, {b.time}</div>
          <div className="pick-meta"><IcClock size={13} style={{ verticalAlign: '-2px' }} /> {fmtDur(b.dur)}</div>
        </div>
        <span className={'badge ' + st.cls}>{st.label}</span>
      </div>

      <div>
        {b.services.map((s, i) => <span key={i} className="schip">{s.name}</span>)}
      </div>

      <div className="divider" />
      <div className="pick-meta" style={{ marginBottom: 4 }}><IcUser size={14} style={{ verticalAlign: '-2px' }} /> {b.master}</div>
      <div className="pick-meta"><IcPin size={14} style={{ verticalAlign: '-2px' }} /> {b.branch}</div>

      <div className="kv" style={{ borderBottom: 0, paddingBottom: 0 }}>
        <span className="k">Итого</span><span className="v" style={{ fontSize: 16 }}>{fmtPrice(b.total)}</span>
      </div>

      {b.status === 'upcoming' && (
        <div className="bcard-actions">
          <button className="btn secondary sm" style={{ flex: 1 }} onClick={() => navigate(`/reschedule/${b.id}`)}>Перенести</button>
          <button className="btn danger sm" style={{ flex: 1 }}>Отменить</button>
        </div>
      )}
    </div>
  )
}
