import { useNavigate } from 'react-router-dom'
import { Frame, Ava } from '../components/ui.jsx'
import { IcCalCheck, IcPin, IcUser, IcClock, IcPhone } from '../icons.jsx'
import { MY_BOOKINGS, fmtPrice, fmtDur, fmtDateFull } from '../data.js'

const STATUS = {
  upcoming: { cls: 'violet', label: 'Предстоит' },
  done: { cls: 'green', label: 'Завершён' },
  cancelled: { cls: 'gray', label: 'Отменён' },
}

export default function MyBookings() {
  const navigate = useNavigate()
  const upcoming = MY_BOOKINGS.filter((b) => b.status === 'upcoming')
  const history = MY_BOOKINGS.filter((b) => b.status !== 'upcoming')

  return (
    <Frame
      title="История записей"
      onMenu={() => navigate('/menu')}
    >
      <div className="pad">
        <div className="allrec">
          <span className="allrec-ico"><IcPhone size={20} /></span>
          <div>
            <div className="allrec-t">Показать все мои записи</div>
            <div className="allrec-s">Поделитесь номером — подтянем историю из базы</div>
          </div>
        </div>

        {!MY_BOOKINGS.length ? (
          <div className="empty">
            <div className="ei"><IcCalCheck size={30} /></div>
            <h4>Тут пока пусто</h4>
            <p className="muted">Запишитесь на услугу — она появится здесь.</p>
            <button className="btn" style={{ maxWidth: 240, margin: '14px auto 0' }} onClick={() => navigate('/')}>Записаться</button>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && <div className="sec-title">Предстоящие</div>}
            {upcoming.map((b) => <BookingCard key={b.id} b={b} />)}
            {history.length > 0 && <div className="sec-title">История</div>}
            {history.map((b) => <BookingCard key={b.id} b={b} />)}
          </>
        )}
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

      <div>{b.services.map((s, i) => <span key={i} className="schip">{s.name}</span>)}</div>

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
