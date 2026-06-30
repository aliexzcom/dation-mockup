import { useState } from 'react'
import {
  PageHead, Button, Card, Badge, Table, Field, Input,
  Select, Checkbox, Chips, Drawer,
} from '../components/ui.jsx'
import { IcPlus } from '../components/icons.jsx'

// ---- мок-данные ----
const INITIAL_USERS = [
  { id: 1, name: 'Алина Смирнова', contact: 'alina@salon.ru', position: 'Администратор', branches: ['Центр'], status: 'active' },
  { id: 2, name: 'Игорь Лебедев', contact: '+7 900 123-45-67', position: 'Барбер', branches: ['Центр', 'Север'], status: 'active' },
  { id: 3, name: 'Светлана Котова', contact: 'kotova@salon.ru', position: 'Мастер маникюра', branches: ['Север'], status: 'active' },
  { id: 4, name: 'Дмитрий Орлов', contact: '+7 911 000-11-22', position: 'Косметолог', branches: ['Центр'], status: 'blocked' },
]

const ACCESS_SECTIONS = [
  'Журнал записей', 'Telegram Mini App', 'Клиенты (CRM)', 'Услуги',
  'Сотрудники', 'Финансы', 'Уведомления',
  'Аналитика и отчёты', 'Настройки', 'Филиалы / Сеть', 'Тарифы и оплата',
]

const AUDIT_LOG = [
  { time: '24.06.2026 11:42', user: 'Алина Смирнова', action: 'Изменён статус записи → Подтверждён', ip: '192.168.1.5' },
  { time: '24.06.2026 10:15', user: 'Игорь Лебедев', action: 'Добавлен клиент Мария Петрова', ip: '192.168.1.8' },
  { time: '23.06.2026 18:00', user: 'Администратор', action: 'Изменены настройки доступа пользователя Дмитрий Орлов', ip: '192.168.1.1' },
  { time: '23.06.2026 16:30', user: 'Светлана Котова', action: 'Создана запись на 24.06.2026 14:00', ip: '192.168.1.9' },
]

const EMPTY_INVITE = { name: '', contact: '', position: '', branch: 'Центральный' }

export default function Users() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [accessDrawer, setAccessDrawer] = useState(null)
  const [auditDrawer, setAuditDrawer] = useState(false)
  const [inviteDrawer, setInviteDrawer] = useState(false)
  const [form, setForm] = useState(EMPTY_INVITE)

  const [accessMap, setAccessMap] = useState(() => {
    const map = {}
    INITIAL_USERS.forEach((u) => {
      map[u.id] = ACCESS_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: true }), {})
    })
    return map
  })
  const [visibilityMap, setVisibilityMap] = useState(() => {
    const map = {}
    INITIAL_USERS.forEach((u) => { map[u.id] = 'Весь филиал' })
    return map
  })

  const toggleSection = (userId, sec) => {
    setAccessMap((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [sec]: !prev[userId][sec] },
    }))
  }

  const handleInviteSave = () => {
    if (!form.name?.trim()) return
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      contact: form.contact,
      position: form.position,
      branches: [form.branch],
      status: 'active',
    }
    setUsers([newUser, ...users])
    setAccessMap((prev) => ({
      ...prev,
      [newUser.id]: ACCESS_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: true }), {}),
    }))
    setVisibilityMap((prev) => ({ ...prev, [newUser.id]: 'Весь филиал' }))
    setForm(EMPTY_INVITE)
    setInviteDrawer(false)
  }

  return (
    <>
      <PageHead
        crumbs="Пользователи"
        title="Пользователи"
        sub="Сотрудники с доступом в веб-кабинет. Доступом управляет владелец индивидуально по каждому разделу."
        actions={<>
          <Button variant="secondary" onClick={() => setAuditDrawer(true)}>Журнал действий</Button>
          <Button onClick={() => setInviteDrawer(true)}><IcPlus size={16} /> Пригласить</Button>
        </>}
      />

      <Card pad={false}>
        <Table
          columns={['Имя', 'Контакт', 'Должность', 'Филиал(ы)', 'Статус', 'Действия']}
          rows={users}
          renderRow={(u, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td className="small muted">{u.contact}</td>
              <td>{u.position}</td>
              <td className="small">{u.branches.join(', ')}</td>
              <td>
                <Badge color={u.status === 'active' ? 'green' : 'red'}>
                  {u.status === 'active' ? 'Активен' : 'Заблокирован'}
                </Badge>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="secondary" onClick={() => setAccessDrawer(u)}>Настроить доступ</Button>
                  <Button size="sm" variant="ghost">Сбросить пароль</Button>
                  <Button size="sm" variant="danger">{u.status === 'active' ? 'Заблокировать' : 'Разблокировать'}</Button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Drawer: Настроить доступ */}
      <Drawer
        title={accessDrawer ? `Доступ: ${accessDrawer.name}` : ''}
        open={!!accessDrawer}
        onClose={() => setAccessDrawer(null)}
        footer={
          <>
            <Button onClick={() => setAccessDrawer(null)}>Сохранить</Button>
            <Button variant="secondary" onClick={() => setAccessDrawer(null)}>Отмена</Button>
          </>
        }
      >
        {accessDrawer && (
          <>
            <div className="note small" style={{ marginBottom: 16 }}>
              Доступом управляет владелец индивидуально по каждому разделу. Предустановленных ролей нет.
            </div>

            <div className="section-title" style={{ marginBottom: 10 }}>Разделы меню</div>
            {ACCESS_SECTIONS.map((sec) => (
              <div key={sec} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <Checkbox
                  label={sec}
                  checked={accessMap[accessDrawer.id]?.[sec] ?? true}
                  onChange={() => toggleSection(accessDrawer.id, sec)}
                />
              </div>
            ))}

            <div className="divider" />

            <Field label="Привязка к филиалам">
              <Select options={['Центральный', 'Северный', 'Все филиалы']} />
            </Field>

            <Field label="Видимость данных">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                <Chips
                  items={['Только свои записи', 'Весь филиал', 'Вся сеть']}
                  active={visibilityMap[accessDrawer.id]}
                  onChange={(v) => setVisibilityMap((prev) => ({ ...prev, [accessDrawer.id]: v }))}
                />
              </div>
            </Field>
          </>
        )}
      </Drawer>

      {/* Drawer: Журнал действий */}
      <Drawer
        title="Журнал действий пользователей"
        open={auditDrawer}
        onClose={() => setAuditDrawer(false)}
        footer={<Button variant="secondary" onClick={() => setAuditDrawer(false)}>Закрыть</Button>}
      >
        <Table
          columns={['Время', 'Пользователь', 'Действие', 'IP']}
          rows={AUDIT_LOG}
          renderRow={(r, i) => (
            <tr key={i}>
              <td className="small muted">{r.time}</td>
              <td style={{ fontWeight: 600 }}>{r.user}</td>
              <td className="small">{r.action}</td>
              <td className="small faint">{r.ip}</td>
            </tr>
          )}
        />
      </Drawer>

      {/* Drawer: Пригласить пользователя */}
      <Drawer
        title="Пригласить пользователя"
        open={inviteDrawer}
        onClose={() => { setInviteDrawer(false); setForm(EMPTY_INVITE) }}
        footer={
          <>
            <Button onClick={handleInviteSave}>Отправить приглашение</Button>
            <Button variant="secondary" onClick={() => { setInviteDrawer(false); setForm(EMPTY_INVITE) }}>Отмена</Button>
          </>
        }
      >
        <Field label="Имя">
          <Input
            placeholder="Полное имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="E-mail или телефон">
          <Input
            placeholder="Введите контакт для отправки приглашения"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </Field>
        <Field label="Должность (текст в профиле)">
          <Input
            placeholder="Например: Администратор, Мастер, Бухгалтер"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </Field>
        <Field label="Филиал(ы)">
          <Select
            options={['Центральный', 'Северный', 'Все филиалы']}
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          />
        </Field>
        <p className="small muted">Пользователь получит ссылку для входа. Доступ к разделам настраивается отдельно.</p>
      </Drawer>
    </>
  )
}
