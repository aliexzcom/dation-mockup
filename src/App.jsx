import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home.jsx'
import BookingFlow from './screens/BookingFlow.jsx'
import MyBookings from './screens/MyBookings.jsx'
import Reschedule from './screens/Reschedule.jsx'

export default function App() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const theme = { dark, toggle: () => setDark((d) => !d) }

  return (
    <div className="frame-wrap">
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/booking" element={<BookingFlow theme={theme} />} />
        <Route path="/my" element={<MyBookings theme={theme} />} />
        <Route path="/reschedule/:id" element={<Reschedule theme={theme} />} />
        <Route path="*" element={<Home theme={theme} />} />
      </Routes>
    </div>
  )
}
