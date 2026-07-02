import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import PairDevice from './screens/PairDevice.jsx'
import StaffSelect from './screens/StaffSelect.jsx'
import Journal from './screens/Journal.jsx'
import Settings from './screens/Settings.jsx'
import { BRANCHES } from './data.js'

export default function App() {
  const [dark, setDark] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [employee, setEmployee] = useState(null)
  const [branch] = useState(BRANCHES[0])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const theme = { dark, toggle: () => setDark((d) => !d) }
  const logout = () => { setAuthed(false); setEmployee(null) }

  // Обёртка рабочих экранов: проверка входа и выбранного профиля
  const work = (active, node) => {
    if (!authed) return <Navigate to="/pair" replace />
    if (!employee) return <Navigate to="/staff" replace />
    return (
      <Layout active={active} employee={employee} onLogout={logout}>
        {node}
      </Layout>
    )
  }

  return (
    <Routes>
      <Route path="/pair" element={<PairDevice theme={theme} onAuth={() => setAuthed(true)} />} />
      <Route path="/staff" element={
        authed
          ? <StaffSelect theme={theme} onPick={setEmployee} onLogout={logout} />
          : <Navigate to="/pair" replace />
      } />
      <Route path="/journal" element={work('journal',
        <Journal employee={employee} creating={creating} setCreating={setCreating} />
      )} />
      <Route path="/settings" element={work('settings', <Settings branch={branch} theme={theme} />)} />
      <Route path="*" element={<Navigate to="/journal" replace />} />
    </Routes>
  )
}
