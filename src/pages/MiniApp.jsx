import { useState } from 'react'
import { PageHead, Button, Card, Tabs, Badge, Field, Input, Textarea, Select, Switch, Chips, KV } from '../components/ui.jsx'
import { IcPlus } from '../components/icons.jsx'

// Мок-данные услуг
const SERVICES = [
  { id: 1, name: 'Стрижка женская', cat: 'Волосы', enabled: true },
  { id: 2, name: 'Окрашивание', cat: 'Волосы', enabled: true },
  { id: 3, name: 'Укладка', cat: 'Волосы', enabled: false },
  { id: 4, name: 'Мужская стрижка', cat: 'Барбер', enabled: true },
  { id: 5, name: 'Стрижка бороды', cat: 'Барбер', enabled: true },
  { id: 6, name: 'Маникюр', cat: 'Ногти', enabled: true },
  { id: 7, name: 'Педикюр', cat: 'Ногти', enabled: false },
  { id: 8, name: 'Чистка лица', cat: 'Косметология', enabled: true },
]

const STAFF = [
  { id: 1, name: 'Анна Морозова', role: 'Парикмахер-стилист', enabled: true },
  { id: 2, name: 'Игорь Лебедев', role: 'Барбер', enabled: true },
  { id: 3, name: 'Светлана Котова', role: 'Мастер маникюра', enabled: true },
  { id: 4, name: 'Дмитрий Орлов', role: 'Косметолог', enabled: false },
]

// Шаги предпросмотра
const STEPS = [
  { n: 1, title: 'Филиал', desc: 'Выбор филиала' },
  { n: 2, title: 'Услуга', desc: 'Категория, услуга, цена и длительность' },
  { n: 3, title: 'Мастер', desc: 'Выбор сотрудника или «Любой свободный»' },
  { n: 4, title: 'Дата и время', desc: 'Доступные слоты в календаре' },
  { n: 5, title: 'Контакты', desc: 'Имя и телефон из Telegram-профиля' },
  { n: 6, title: 'Подтверждение', desc: 'Итог записи, предоплата / депозит' },
  { n: 7, title: 'Готово', desc: 'Детали записи, кнопки «Перенести»/«Отменить»' },
]

export default function MiniApp() {
  const [tab, setTab] = useState('Настройки')
  const [previewStep, setPreviewStep] = useState(1)

  return (
    <>
      <PageHead
        crumbs="Telegram Mini App"
        title="Telegram Mini App"
        sub="Настройка клиентского модуля онлайн-записи через Telegram: услуги, слоты, бот и брендинг."
        actions={
          <Button>
            <IcPlus size={16} /> Сохранить настройки
          </Button>
        }
      />

      <Tabs
        tabs={['Настройки', 'Предпросмотр записи', 'Подключение бота']}
        active={tab}
        onChange={setTab}
      />

      {tab === 'Настройки' && <SettingsTab />}
      {tab === 'Предпросмотр записи' && <PreviewTab step={previewStep} setStep={setPreviewStep} />}
      {tab === 'Подключение бота' && <BotTab />}
    </>
  )
}

// ——— Вкладка «Настройки» ————————————————————————————————————————————————

function SettingsTab() {
  const [services, setServices] = useState(SERVICES)
  const [staff, setStaff] = useState(STAFF)
  const [slotStep, setSlotStep] = useState('30 мин')
  const [minBefore, setMinBefore] = useState('2 ч')
  const [maxHorizon, setMaxHorizon] = useState('30 дней')
  const [buffer, setBuffer] = useState('10 мин')
  const [moderation, setModeration] = useState('Автоподтверждение')
  const [autoConfirm, setAutoConfirm] = useState(true)
  const [multiLang, setMultiLang] = useState(false)
  const [pdConsent, setPdConsent] = useState('Нажимая «Записаться», вы соглашаетесь с обработкой персональных данных согласно политике конфиденциальности.')
  const [oferta, setOferta] = useState('Запись является офертой. Отмена возможна не позднее чем за 2 часа до начала.')
  const [welcomeText, setWelcomeText] = useState('Добро пожаловать! Запишитесь онлайн за несколько секунд.')

  function toggleService(id) {
    setServices(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  }

  function toggleStaff(id) {
    setStaff(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  }

  return (
    <div className="grid">

      {/* Услуги и сотрудники */}
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <Card title="Доступные услуги" actions={<Button size="sm" variant="ghost">Все вкл.</Button>}>
          {services.map(s => (
            <div className="list-line" key={s.id}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                <div className="small muted">{s.cat}</div>
              </div>
              <Switch on={s.enabled} onClick={() => toggleService(s.id)} />
            </div>
          ))}
        </Card>

        <Card title="Доступные сотрудники" actions={<Button size="sm" variant="ghost">Все вкл.</Button>}>
          {staff.map(s => (
            <div className="list-line" key={s.id}>
              <div className="avatar-sm">{s.name.split(' ').map(w => w[0]).join('')}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                <div className="small muted">{s.role}</div>
              </div>
              <Switch on={s.enabled} onClick={() => toggleStaff(s.id)} />
            </div>
          ))}
        </Card>
      </div>

      {/* Правила слотов */}
      <Card title="Правила слотов и ограничений">
        <div className="grid grid-2">
          <Field label="Шаг слотов">
            <Select
              value={slotStep}
              onChange={e => setSlotStep(e.target.value)}
              options={['10 мин', '15 мин', '30 мин', '60 мин']}
            />
          </Field>
          <Field label="Буфер между записями">
            <Select
              value={buffer}
              onChange={e => setBuffer(e.target.value)}
              options={['0 мин', '5 мин', '10 мин', '15 мин', '30 мин']}
            />
          </Field>
          <Field label="Минимальное время до записи">
            <Select
              value={minBefore}
              onChange={e => setMinBefore(e.target.value)}
              options={['0', '30 мин', '1 ч', '2 ч', '4 ч', '24 ч']}
            />
          </Field>
          <Field label="Максимальный горизонт записи">
            <Select
              value={maxHorizon}
              onChange={e => setMaxHorizon(e.target.value)}
              options={['7 дней', '14 дней', '30 дней', '60 дней', '90 дней']}
            />
          </Field>
        </div>
        <div className="note small" style={{ marginTop: 8 }}>
          Буфер — нерабочее время между визитами, не видно клиенту.
        </div>
      </Card>

      {/* Тексты и согласие */}
      <Card title="Тексты и юридические сведения">
        <Field label="Приветственный текст">
          <Textarea value={welcomeText} onChange={e => setWelcomeText(e.target.value)} rows={2} />
        </Field>
        <Field label="Согласие на обработку персональных данных">
          <Textarea value={pdConsent} onChange={e => setPdConsent(e.target.value)} rows={3} />
        </Field>
        <Field label="Текст оферты / условий отмены">
          <Textarea value={oferta} onChange={e => setOferta(e.target.value)} rows={3} />
        </Field>
      </Card>

      {/* Модерация */}
      <Card title="Модерация записей">
        <div className="list-line" style={{ marginBottom: 8 }}>
          <Switch on={autoConfirm} onClick={() => setAutoConfirm(v => !v)} />
          <div>
            <div style={{ fontWeight: 600 }}>Автоподтверждение записей</div>
            <div className="small muted">Новые записи подтверждаются без участия администратора</div>
          </div>
        </div>
        {!autoConfirm && (
          <div className="note small" style={{ marginTop: 4 }}>
            Записи будут попадать в статус «Ожидает подтверждения». Администратор подтверждает вручную в журнале.
          </div>
        )}
        <div className="divider" />
        <Field label="Режим модерации">
          <Chips
            items={['Автоподтверждение', 'Ручное подтверждение', 'По типу услуги']}
            active={moderation}
            onChange={setModeration}
          />
        </Field>
      </Card>

      {/* Брендинг */}
      <Card title="Брендинг Mini App">
        <div className="grid grid-2">
          <Field label="URL логотипа">
            <Input placeholder="https://example.com/logo.png" />
          </Field>
          <Field label="URL обложки (header image)">
            <Input placeholder="https://example.com/cover.jpg" />
          </Field>
          <Field label="Основной цвет (hex)">
            <Input placeholder="#7C3AED" defaultValue="#7C3AED" />
          </Field>
          <Field label="Цвет кнопок">
            <Input placeholder="#6D28D9" defaultValue="#6D28D9" />
          </Field>
        </div>
        <div className="divider" />
        <div className="list-line">
          <Switch on={multiLang} onClick={() => setMultiLang(v => !v)} />
          <div>
            <div style={{ fontWeight: 600 }}>Многоязычность</div>
            <div className="small muted">Показывать Mini App на языке Telegram-клиента (RU / EN / UZ)</div>
          </div>
        </div>
        {multiLang && (
          <div className="note small" style={{ marginTop: 8 }}>
            Переводы добавляются в разделе «Настройки — Локализация». По умолчанию — русский.
          </div>
        )}
      </Card>

      <div className="toolbar">
        <div className="spacer" />
        <Button variant="secondary">Сбросить</Button>
        <Button>Сохранить настройки</Button>
      </div>
    </div>
  )
}

// ——— Вкладка «Предпросмотр записи» ——————————————————————————————————————

const PREVIEW_CONTENT = {
  1: <PreviewStep1 />,
  2: <PreviewStep2 />,
  3: <PreviewStep3 />,
  4: <PreviewStep4 />,
  5: <PreviewStep5 />,
  6: <PreviewStep6 />,
  7: <PreviewStep7 />,
}

function PreviewTab({ step, setStep }) {
  return (
    <div className="grid">
      <div className="note small" style={{ marginBottom: 0 }}>
        Ниже показан клиентский контур онлайн-записи в Telegram Mini App. Авторизация — автоматически через Telegram-профиль. Mini App поддерживает light/dark тему Telegram. Личный кабинет клиента доступен по кнопке в меню (будущие и прошлые записи). Предоплата через онлайн-эквайринг Telegram Payments.
      </div>

      {/* Степпер */}
      <div className="toolbar" style={{ flexWrap: 'wrap', gap: 6 }}>
        {STEPS.map(s => (
          <button
            key={s.n}
            onClick={() => setStep(s.n)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: step === s.n ? 'var(--primary)' : 'var(--border)',
              background: step === s.n ? 'var(--primary)' : 'transparent',
              color: step === s.n ? '#fff' : 'var(--text-muted)',
              fontWeight: step === s.n ? 700 : 400,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {s.n}. {s.title}
          </button>
        ))}
      </div>

      {/* Телефонный макет */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 360,
          minHeight: 520,
          border: '2px solid var(--border)',
          borderRadius: 24,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        }}>
          {/* Шапка Mini App */}
          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '16px 20px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: 18, lineHeight: 1 }}
              >
                &larr;
              </button>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Dation — Онлайн-запись</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                Шаг {step} из {STEPS.length}: {STEPS[step - 1].desc}
              </div>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div style={{ height: 4, background: '#EDE9FE' }}>
            <div style={{ height: 4, background: 'var(--primary)', width: `${(step / STEPS.length) * 100}%`, transition: 'width .3s' }} />
          </div>

          {/* Контент шага */}
          <div style={{ padding: '20px 16px' }}>
            {PREVIEW_CONTENT[step]}
          </div>

          {/* Навигация */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            {step < 7 && (
              <button
                onClick={() => setStep(s => Math.min(7, s + 1))}
                style={{
                  flex: 1, padding: '10px 0', background: 'var(--primary)',
                  color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                {step === 6 ? 'Подтвердить запись' : 'Далее'}
              </button>
            )}
            {step === 7 && (
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1, padding: '10px 0', background: 'var(--primary)',
                  color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                Записаться ещё раз
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewStep1() {
  const branches = [
    { name: 'Центральный филиал', addr: 'ул. Пушкина, 12', dist: '1.2 км' },
    { name: 'Северный филиал', addr: 'пр. Победы, 44', dist: '3.7 км' },
    { name: 'Южный филиал', addr: 'ул. Садовая, 8', dist: '5.1 км' },
  ]
  const [sel, setSel] = useState(0)
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Выберите филиал</div>
      {branches.map((b, i) => (
        <div
          key={i}
          onClick={() => setSel(i)}
          style={{
            padding: '12px 14px', borderRadius: 12, marginBottom: 8, cursor: 'pointer',
            border: `2px solid ${sel === i ? 'var(--primary)' : 'var(--border)'}`,
            background: sel === i ? '#F5F3FF' : '#fff',
          }}
        >
          <div style={{ fontWeight: 600 }}>{b.name}</div>
          <div className="small muted">{b.addr}</div>
          <div className="small faint">{b.dist} от вас</div>
        </div>
      ))}
    </div>
  )
}

function PreviewStep2() {
  const cats = ['Волосы', 'Барбер', 'Ногти', 'Косметология']
  const [cat, setCat] = useState('Волосы')
  const [sel, setSel] = useState(null)
  const items = [
    { name: 'Стрижка', price: '800 р.', dur: '45 мин' },
    { name: 'Окрашивание', price: '3 500 р.', dur: '2 ч 30 мин' },
    { name: 'Укладка', price: '600 р.', dur: '30 мин' },
  ]
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Выберите услугу</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {cats.map(c => (
          <span
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '4px 12px', borderRadius: 16, fontSize: 13, cursor: 'pointer',
              background: cat === c ? 'var(--primary)' : '#F3F4F6',
              color: cat === c ? '#fff' : 'var(--text-muted)',
              fontWeight: cat === c ? 600 : 400,
            }}
          >{c}</span>
        ))}
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          onClick={() => setSel(i)}
          style={{
            padding: '11px 13px', borderRadius: 10, marginBottom: 7, cursor: 'pointer',
            border: `2px solid ${sel === i ? 'var(--primary)' : 'var(--border)'}`,
            background: sel === i ? '#F5F3FF' : '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{it.name}</div>
            <div className="small muted">{it.dur}</div>
          </div>
          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{it.price}</div>
        </div>
      ))}
    </div>
  )
}

function PreviewStep3() {
  const [sel, setSel] = useState(null)
  const masters = [
    { name: 'Любой свободный мастер', role: '', rating: null, ini: '?' },
    { name: 'Анна Морозова', role: 'Парикмахер-стилист', rating: '4.9', ini: 'АМ' },
    { name: 'Игорь Лебедев', role: 'Барбер', rating: '4.8', ini: 'ИЛ' },
  ]
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Выберите мастера</div>
      {masters.map((m, i) => (
        <div
          key={i}
          onClick={() => setSel(i)}
          style={{
            padding: '11px 13px', borderRadius: 12, marginBottom: 8, cursor: 'pointer',
            border: `2px solid ${sel === i ? 'var(--primary)' : 'var(--border)'}`,
            background: sel === i ? '#F5F3FF' : '#fff',
            display: 'flex', gap: 12, alignItems: 'center',
          }}
        >
          <div className="avatar-sm" style={{ flexShrink: 0 }}>{m.ini}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{m.name}</div>
            {m.role && <div className="small muted">{m.role}</div>}
          </div>
          {m.rating && (
            <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: 13 }}>{m.rating}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function PreviewStep4() {
  const slots = ['09:00', '09:30', '10:00', '10:30', '12:00', '14:00', '14:30', '15:00', '16:30', '17:00']
  const [sel, setSel] = useState(null)
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Выберите дату и время</div>
      <div className="small muted" style={{ marginBottom: 12 }}>Вторник, 24 июня 2026</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
        {slots.map((s, i) => (
          <div
            key={i}
            onClick={() => setSel(i)}
            style={{
              textAlign: 'center', padding: '9px 0', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600,
              border: `2px solid ${sel === i ? 'var(--primary)' : 'var(--border)'}`,
              background: sel === i ? 'var(--primary)' : '#fff',
              color: sel === i ? '#fff' : 'var(--text)',
            }}
          >{s}</div>
        ))}
      </div>
    </div>
  )
}

function PreviewStep5() {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Ваши контакты</div>
      <div className="small muted" style={{ marginBottom: 14 }}>Данные получены из вашего Telegram-профиля</div>
      <Field label="Имя"><Input defaultValue="Мария Петрова" /></Field>
      <Field label="Телефон"><Input defaultValue="+7 912 345-67-89" /></Field>
      <Field label="Комментарий к записи"><Textarea placeholder="Пожелания мастеру (необязательно)" rows={2} /></Field>
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-faint)' }}>
        Нажимая «Далее», вы соглашаетесь с обработкой персональных данных согласно политике конфиденциальности.
      </div>
    </div>
  )
}

function PreviewStep6() {
  const [paid, setPaid] = useState(false)
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Подтвердите запись</div>
      <KV items={[
        ['Филиал', 'Центральный, ул. Пушкина, 12'],
        ['Услуга', 'Стрижка женская'],
        ['Мастер', 'Анна Морозова'],
        ['Дата', 'Вт, 24 июня 2026'],
        ['Время', '10:00 — 10:45'],
        ['Стоимость', '800 р.'],
      ]} />
      <div className="divider" />
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Предоплата</div>
      <div className="list-line" style={{ marginBottom: 6 }}>
        <Switch on={paid} onClick={() => setPaid(v => !v)} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Внести предоплату сейчас</div>
          <div className="small muted">200 р. через Telegram Payments</div>
        </div>
      </div>
      {paid && (
        <div className="note small">
          Оплата через встроенный эквайринг Telegram. После подтверждения средства будут заморожены до визита.
        </div>
      )}
    </div>
  )
}

function PreviewStep7() {
  return (
    <div style={{ textAlign: 'center', paddingTop: 8 }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px', fontSize: 26,
      }}>
        <span style={{ color: '#16A34A', fontSize: 28, lineHeight: 1 }}>&#10003;</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Запись создана</div>
      <div className="muted small" style={{ marginBottom: 16 }}>Мы отправим напоминание за 24 ч и за 1 ч до визита</div>
      <KV items={[
        ['Услуга', 'Стрижка женская'],
        ['Мастер', 'Анна Морозова'],
        ['Дата', 'Вт, 24 июня 2026'],
        ['Время', '10:00'],
        ['Адрес', 'ул. Пушкина, 12'],
      ]} />
      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        <button style={{
          flex: 1, padding: '9px 0', borderRadius: 10, border: '1.5px solid var(--border)',
          background: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}>Перенести</button>
        <button style={{
          flex: 1, padding: '9px 0', borderRadius: 10, border: '1.5px solid #FCA5A5',
          background: '#FEF2F2', color: '#EF4444', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        }}>Отменить</button>
      </div>
      <div className="small faint" style={{ marginTop: 12 }}>
        Личный кабинет: все ваши записи доступны в главном меню Mini App.
      </div>
    </div>
  )
}

// ——— Вкладка «Подключение бота» —————————————————————————————————————————

function BotTab() {
  const [token, setToken] = useState('7412345678:AAFxyz...')
  const [menuBtn, setMenuBtn] = useState('Записаться')
  const [welcome, setWelcome] = useState('Привет! Я — бот салона Dation. Нажмите кнопку ниже, чтобы записаться онлайн.')
  const [linked, setLinked] = useState(false)

  return (
    <div className="grid">
      <Card title="Токен и подключение бота">
        <Field label="Bot API Token">
          <Input
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Введите токен из @BotFather"
            type="password"
          />
        </Field>
        <div className="note small" style={{ marginBottom: 14 }}>
          Получите токен в @BotFather: /newbot или /mybots. Токен хранится в зашифрованном виде.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => setLinked(true)}>Подключить бота</Button>
          {linked && <Badge color="green">Подключён</Badge>}
        </div>
      </Card>

      <Card title="Кнопка-меню и приветствие">
        <Field label="Текст кнопки меню в боте">
          <Input value={menuBtn} onChange={e => setMenuBtn(e.target.value)} placeholder="Записаться" />
        </Field>
        <Field label="Приветственное сообщение бота">
          <Textarea value={welcome} onChange={e => setWelcome(e.target.value)} rows={3} />
        </Field>
      </Card>

      <Card title="Ссылки и QR-код">
        <div className="grid grid-2">
          <div>
            <div className="small muted" style={{ marginBottom: 6 }}>Ссылка на Mini App</div>
            <div style={{
              padding: '10px 14px', borderRadius: 8, background: '#F9FAFB',
              border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 13,
              wordBreak: 'break-all', color: 'var(--text-muted)',
            }}>
              https://t.me/DationSalonBot/app
            </div>
          </div>
          <div>
            <div className="small muted" style={{ marginBottom: 6 }}>Deep link для бота</div>
            <div style={{
              padding: '10px 14px', borderRadius: 8, background: '#F9FAFB',
              border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 13,
              wordBreak: 'break-all', color: 'var(--text-muted)',
            }}>
              https://t.me/DationSalonBot?start=book
            </div>
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: 16 }}>
          <Button variant="secondary">Скопировать ссылку на Mini App</Button>
          <Button variant="secondary">Сгенерировать QR на бота</Button>
          <Button variant="secondary">Предпросмотр</Button>
          <div className="spacer" />
          <Button>Сохранить настройки</Button>
        </div>
      </Card>

      <Card title="Статус интеграции">
        <KV items={[
          ['Имя бота', '@DationSalonBot'],
          ['Статус вебхука', linked ? 'Активен' : 'Не настроен'],
          ['Mini App URL', 'https://t.me/DationSalonBot/app'],
          ['Последняя активность', '24 июня 2026, 11:42'],
          ['Всего записей через бота', '1 247'],
        ]} />
      </Card>
    </div>
  )
}
