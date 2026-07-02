import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Frame } from '../components/ui.jsx'
import { DateTimePicker } from '../components/DateTime.jsx'
import { IcCheck, IcUser, IcPin } from '../icons.jsx'
import { MY_BOOKINGS, fmtDur, fmtDateFull } from '../data.js'

export default function Reschedule() {
  const { id } = useParams()
  const navigate = useNavigate()
  const booking = MY_BOOKINGS.find((b) => b.id === id) || MY_BOOKINGS[0]

  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [done, setDone] = useState(false)

  // ----- Экран успеха переноса -----
  if (done) {
    return (
      <Frame title="Готово" subtitle={booking.branch}>
        <div className="pad center">
          <div className="success-ico"><IcCheck size={42} /></div>
          <h2 className="h-screen">Запись перенесена</h2>
          <p className="h-sub">Мы уведомили мастера. Новые детали отправлены вам в Telegram.</p>

          <div className="summary" style={{ textAlign: 'left' }}>
            <div className="kv">
              <span className="k">Было</span>
              <span className="v" style={{ color: 'var(--text-faint)', textDecoration: 'line-through' }}>
                {fmtDateFull(booking.date)}, {booking.time}
              </span>
            </div>
            <div className="kv"><span className="k">Стало</span><span className="v">{fmtDateFull(date)}, {time}</span></div>
            <div className="kv"><span className="k">Мастер</span><span className="v">{booking.master}</span></div>
            <div className="kv"><span className="k">Услуги</span><span className="v">{booking.services.map((s) => s.name).join(', ')}</span></div>
          </div>

          <div style={{ marginTop: 18 }}>
            <button className="btn" onClick={() => navigate('/my')}>Мои записи</button>
          </div>
        </div>
      </Frame>
    )
  }

  // ----- Экран выбора нового времени -----
  return (
    <Frame
      title="Перенос записи"
      subtitle={booking.branch}
      onBack={() => navigate('/my')}
      footer={
        <button className="btn" disabled={!date || !time} onClick={() => setDone(true)}>
          {date && time ? `Перенести на ${time}` : 'Выберите новое время'}
        </button>
      }
    >
      <div className="pad">
        <div className="sec-title">Текущая запись</div>
        <div className="summary">
          <div className="kv"><span className="k">Когда</span><span className="v">{fmtDateFull(booking.date)}, {booking.time} · {fmtDur(booking.dur)}</span></div>
          <div className="kv"><span className="k">Услуги</span><span className="v">{booking.services.map((s) => s.name).join(', ')}</span></div>
        </div>
        <div className="pick-meta" style={{ margin: '10px 2px 0' }}><IcUser size={14} style={{ verticalAlign: '-2px' }} /> {booking.master}</div>
        <div className="pick-meta" style={{ margin: '4px 2px 0' }}><IcPin size={14} style={{ verticalAlign: '-2px' }} /> {booking.branch}</div>

        <h2 className="h-screen" style={{ marginTop: 20 }}>Новые дата и время</h2>
        <p className="h-sub">Выберите удобный свободный слот</p>
        <DateTimePicker date={date} time={time}
          onDate={(k) => { setDate(k); setTime(null) }} onTime={setTime} />
      </div>
    </Frame>
  )
}
