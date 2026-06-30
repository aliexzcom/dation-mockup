import { IcClock } from '../icons.jsx'
import { SLOTS, BUSY, nextDays } from '../data.js'

const DAYS = nextDays(14)

// Лента дат + слоты времени по периодам. Используется в записи и в переносе.
export function DateTimePicker({ date, time, onDate, onTime }) {
  return (
    <>
      <div className="sec-title">Дата</div>
      <div className="date-strip">
        {DAYS.map((d) => (
          <button key={d.key} className={'date-chip' + (date === d.key ? ' sel' : '')} onClick={() => onDate(d.key)}>
            <div className="wd">{d.wd}</div>
            <div className="dd">{d.dd}</div>
            <div className="mo">{d.mo}</div>
          </button>
        ))}
      </div>

      {date ? <Slots time={time} onPick={onTime} /> : (
        <div className="note" style={{ marginTop: 12 }}>Выберите дату, чтобы увидеть свободное время.</div>
      )}
    </>
  )
}

function Slots({ time, onPick }) {
  const periods = [
    { key: 'morning', label: 'Утро', items: SLOTS.morning },
    { key: 'day', label: 'День', items: SLOTS.day },
    { key: 'evening', label: 'Вечер', items: SLOTS.evening },
  ]
  return (
    <>
      <div className="sec-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IcClock size={14} /> Время
      </div>
      {periods.map((p) => (
        <div key={p.key}>
          <div className="slot-period">{p.label}</div>
          <div className="slot-grid">
            {p.items.map((t) => {
              const off = BUSY.includes(t)
              return (
                <button key={t} className={'slot' + (off ? ' off' : '') + (time === t ? ' sel' : '')}
                  disabled={off} onClick={() => onPick(t)}>{t}</button>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}
