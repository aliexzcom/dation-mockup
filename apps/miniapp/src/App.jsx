import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home.jsx'
import MyBookings from './screens/MyBookings.jsx'
import Reschedule from './screens/Reschedule.jsx'
import Menu from './screens/Menu.jsx'
import Profile from './screens/Profile.jsx'
import Settings from './screens/Settings.jsx'
import Reviews from './screens/Reviews.jsx'

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
        <Route path="/my" element={<MyBookings theme={theme} />} />
        <Route path="/menu" element={<Menu theme={theme} />} />
        <Route path="/profile" element={<Profile theme={theme} />} />
        <Route path="/settings" element={<Settings theme={theme} />} />
        <Route path="/reviews" element={<Reviews theme={theme} />} />
        <Route path="/reschedule/:id" element={<Reschedule theme={theme} />} />
        <Route path="*" element={<Home theme={theme} />} />
      </Routes>
    </div>
  )
}
