import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHead, Card, Field, Input, Select, Button, Switch, Badge } from '../components/ui.jsx'

// Профиль текущего пользователя (открывается из аватара в Topbar)
export default function Profile() {
  const navigate = useNavigate()
  const [twoFA, setTwoFA] = useState(false)
  const [notify, setNotify] = useState(true)

  return (
    <>
      <PageHead crumbs="Профиль" title="Мой профиль" sub="Личные данные, безопасность входа и параметры аккаунта." />

      <div className="grid" style={{ gridTemplateColumns: '300px 1fr', alignItems: 'start' }}>
        {/* Левая карточка пользователя */}
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 28, margin: '0 auto 12px' }}>ОВ</div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Олег Владимиров</div>
            <div className="muted small">Владелец</div>
            <div style={{ marginTop: 8 }}><Badge color="green">Активен</Badge></div>
            <div className="divider" />
            <div className="small muted" style={{ textAlign: 'left' }}>
              <div className="kv"><span className="k">Филиалы</span><span>Все</span></div>
              <div className="kv"><span className="k">В системе с</span><span>12.01.2026</span></div>
              <div className="kv"><span className="k">Последний вход</span><span>сегодня, 09:12</span></div>
            </div>
            <Button variant="danger" className="block" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>Выйти из аккаунта</Button>
          </div>
        </Card>

        {/* Правая часть — формы */}
        <div className="grid">
          <Card title="Личные данные" actions={<Button size="sm">Сохранить</Button>}>
            <div className="grid grid-2">
              <Field label="Имя"><Input defaultValue="Олег" /></Field>
              <Field label="Фамилия"><Input defaultValue="Владимиров" /></Field>
              <Field label="Телефон"><Input defaultValue="+7 900 123-45-67" /></Field>
              <Field label="E-mail"><Input defaultValue="oleg@aura-salon.ru" /></Field>
              <Field label="Должность"><Input defaultValue="Владелец" /></Field>
              <Field label="Язык интерфейса"><Select options={['Русский', 'Казахский', 'Узбекский', 'English']} /></Field>
            </div>
          </Card>

          <Card title="Смена пароля" actions={<Button size="sm">Обновить пароль</Button>}>
            <div className="grid grid-2">
              <Field label="Текущий пароль"><Input type="password" placeholder="••••••••" /></Field>
              <div />
              <Field label="Новый пароль"><Input type="password" placeholder="Минимум 8 символов" /></Field>
              <Field label="Повторите новый пароль"><Input type="password" placeholder="Повторите пароль" /></Field>
            </div>
          </Card>

          <Card title="Безопасность и уведомления">
            <div className="list-line">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Двухфакторная аутентификация</div>
                <div className="small muted">Код подтверждения при входе через Telegram или e-mail</div>
              </div>
              <Switch on={twoFA} onClick={() => setTwoFA(!twoFA)} />
            </div>
            <div className="list-line">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Уведомления о новых записях</div>
                <div className="small muted">Получать оповещения о записях из Telegram Mini App</div>
              </div>
              <Switch on={notify} onClick={() => setNotify(!notify)} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
