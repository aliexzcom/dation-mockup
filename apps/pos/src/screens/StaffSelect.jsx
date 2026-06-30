import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle, Tick } from '../components/ui.jsx'
import PinPad from '../components/PinPad.jsx'
import { IcLogout, IcClose, IcPin } from '../icons.jsx'
import { STAFF, COMPANY, BRANCHES } from '../data.js'

export default function StaffSelect({ theme, onPick, onLogout, branch, onChangeBranch }) {
  const navigate = useNavigate()
  const [sel, setSel] = useState(null)        // выбранный профиль для ввода PIN
  const [branchPick, setBranchPick] = useState(false)

  const accessible = STAFF.filter((s) => s.posAccess)

  const enter = () => {
    onPick(sel)
    navigate('/journal')
  }

  return (
    <div className="full">
      <div style={{ position: 'fixed', top: 18, right: 18, display: 'flex', gap: 10 }}>
        <ThemeToggle theme={theme} />
        <button className="btn ghost sm" onClick={() => { onLogout(); navigate('/pair') }}>
          <IcLogout size={16} /> Выйти из терминала
        </button>
      </div>

      <div className="brand-row">
        <div className="brand-mark"><img src="/logo-mark.svg" alt="Dation" /></div>
        <div className="brand-name">Выберите профиль<span>{COMPANY.name}</span></div>
      </div>

      <button className="btn ghost" style={{ marginBottom: 22 }} onClick={() => setBranchPick(true)}>
        <IcPin size={17} /> {branch.name}
      </button>

      <div className="staff-grid">
        {accessible.map((s) => (
          <div key={s.id} className="staff-card" onClick={() => setSel(s)}>
            <div className="staff-ava" style={{ background: s.color }}>{s.initials}</div>
            <div className="nm">{s.name}</div>
            <div className="rl">{s.role}</div>
          </div>
        ))}
      </div>

      <div className="muted" style={{ marginTop: 22, fontSize: 13 }}>
        Видны только сотрудники с доступом к POS-терминалу
      </div>

      {branchPick && (
        <div className="overlay center" onClick={() => setBranchPick(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Выбор филиала</h3>
              <div style={{ flex: 1 }} />
              <button className="icon-btn" onClick={() => setBranchPick(false)} aria-label="Закрыть"><IcClose size={18} /></button>
            </div>
            <div className="modal-body">
              {BRANCHES.map((b) => (
                <button key={b.id} className={'pick' + (branch.id === b.id ? ' sel' : '')}
                  onClick={() => { onChangeBranch(b); setBranchPick(false) }}>
                  <div className="who-ava" style={{ background: 'var(--violet)', width: 38, height: 38 }}><IcPin size={18} /></div>
                  <div className="pb"><div className="pt">{b.name}</div><div className="pm">{b.addr}</div></div>
                  <Tick on={branch.id === b.id} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {sel && (
        <div className="overlay center" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="who-ava" style={{ background: sel.color, width: 40, height: 40 }}>{sel.initials}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16 }}>{sel.name}</h3>
                <div className="muted" style={{ fontSize: 13 }}>Введите PIN-код</div>
              </div>
              <button className="icon-btn" onClick={() => setSel(null)} aria-label="Закрыть"><IcClose size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PinPad expectedPin={sel.pin} onSuccess={enter} />
              <div className="note" style={{ marginTop: 18 }}>Демо-PIN: {sel.pin}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
