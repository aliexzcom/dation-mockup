import { useState } from 'react'
import { PageHead, Button, Card, Tabs, Badge, Field, Input, Textarea, Select, Switch, Chips, KV } from '../components/ui.jsx'
import { IcPlus, IcTrash } from '../components/icons.jsx'

// Мок-данные услуг (каталог клиентского мини-аппа)
const SERVICES = [
  { id: 's1', name: 'Женская стрижка', cat: 'Парикмахерские услуги', enabled: true },
  { id: 's2', name: 'Мужская стрижка', cat: 'Парикмахерские услуги', enabled: true },
  { id: 's3', name: 'Окрашивание в один тон', cat: 'Парикмахерские услуги', enabled: true },
  { id: 's4', name: 'Укладка', cat: 'Парикмахерские услуги', enabled: true },
  { id: 's5', name: 'Маникюр с покрытием', cat: 'Ногтевой сервис', enabled: true },
  { id: 's6', name: 'Педикюр', cat: 'Ногтевой сервис', enabled: true },
  { id: 's7', name: 'Снятие + укрепление', cat: 'Ногтевой сервис', enabled: false },
  { id: 's8', name: 'Коррекция и окрашивание бровей', cat: 'Брови и ресницы', enabled: true },
  { id: 's9', name: 'Ламинирование ресниц', cat: 'Брови и ресницы', enabled: true },
]

const STAFF = [
  { id: 'm1', name: 'Дильноза Каримова', role: 'Стилист-колорист', enabled: true },
  { id: 'm2', name: 'Азиз Рахимов', role: 'Барбер', enabled: true },
  { id: 'm3', name: 'Нигора Саидова', role: 'Мастер маникюра', enabled: true },
  { id: 'm4', name: 'Сабина Алиева', role: 'Бровист, лешмейкер', enabled: true },
]

// Рекламные афиши (карусель на главном экране Mini App)
const BADGES = ['Акция', 'Подарок', 'Новинка', 'Приведи друга', 'Хит']
const INITIAL_BANNERS = [
  { id: 'p1', badge: 'Акция', title: 'Окрашивание −20%', sub: 'Весь июль на сложное окрашивание', enabled: true },
  { id: 'p2', badge: 'Подарок', title: 'Маникюр + педикюр', sub: 'Снятие покрытия бесплатно', enabled: true },
  { id: 'p3', badge: 'Новинка', title: 'Ламинирование ресниц', sub: 'Эффект на 6–8 недель', enabled: true },
  { id: 'p4', badge: 'Приведи друга', title: '−15% вам обоим', sub: 'За каждого приглашённого', enabled: false },
]

// Фото работ — показываются на главном экране Mini App вперемешку с отзывами
const INITIAL_WORK_PHOTOS = [
  { id: 'w1', url: 'https://picsum.photos/seed/dation-a/500', enabled: true },
  { id: 'w2', url: 'https://picsum.photos/seed/dation-b/500', enabled: true },
  { id: 'w3', url: 'https://picsum.photos/seed/dation-c/500', enabled: true },
  { id: 'w4', url: 'https://picsum.photos/seed/dation-d/500', enabled: false },
]

// Сопоставление маршрута раздела и подписи вкладки
const VIEW_TABS = { settings: 'Настройки', preview: 'Предпросмотр записи', bot: 'Подключение бота' }

// view: 'settings' | 'preview' | 'bot' — раздел приходит из меню (маршрута).
// Если view не задан — показываем вкладки внутри страницы.
export default function MiniApp({ view = null }) {
  const [tab, setTab] = useState('Настройки')
  const activeTab = view ? VIEW_TABS[view] : tab

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

      {!view && (
        <Tabs
          tabs={['Настройки', 'Предпросмотр записи', 'Подключение бота']}
          active={tab}
          onChange={setTab}
        />
      )}

      {activeTab === 'Настройки' && <SettingsTab />}
      {activeTab === 'Предпросмотр записи' && <PreviewTab />}
      {activeTab === 'Подключение бота' && <BotTab />}
    </>
  )
}

// ——— Вкладка «Настройки» ————————————————————————————————————————————————

function SettingsTab() {
  const [services, setServices] = useState(SERVICES)
  const [staff, setStaff] = useState(STAFF)
  const [banners, setBanners] = useState(INITIAL_BANNERS)
  const [photos, setPhotos] = useState(INITIAL_WORK_PHOTOS)
  const [featured, setFeatured] = useState(['s1', 's5', 's9'])
  const [requireDeposit, setRequireDeposit] = useState(true)
  const [depositType, setDepositType] = useState('Фиксированная сумма')
  const [depositAmount, setDepositAmount] = useState('50000')
  const [slotStep, setSlotStep] = useState('30 мин')
  const [minBefore, setMinBefore] = useState('2 ч')
  const [maxHorizon, setMaxHorizon] = useState('30 дней')
  const [buffer, setBuffer] = useState('10 мин')
  const [moderation, setModeration] = useState('Автоподтверждение')
  const [autoConfirm, setAutoConfirm] = useState(true)
  const [multiLang, setMultiLang] = useState(false)
  const [pdConsent, setPdConsent] = useState('Нажимая «Записаться», вы соглашаетесь с обработкой персональных данных согласно политике конфиденциальности.')
  const [oferta, setOferta] = useState('Запись является офертой. Отмена возможна не позднее чем за 2 часа до начала.')
  const [welcomeText, setWelcomeText] = useState('Записывайтесь онлайн за пару касаний')

  function toggleService(id) {
    setServices(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  }

  function toggleStaff(id) {
    setStaff(s => s.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  }

  const toggleBanner = (id) => setBanners(b => b.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  const updateBanner = (id, field, val) => setBanners(b => b.map(x => x.id === id ? { ...x, [field]: val } : x))
  const removeBanner = (id) => setBanners(b => b.filter(x => x.id !== id))
  const addBanner = () => setBanners(b => [...b, { id: 'p' + Date.now(), badge: 'Акция', title: '', sub: '', enabled: true }])
  const togglePhoto = (id) => setPhotos(p => p.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x))
  const updatePhoto = (id, url) => setPhotos(p => p.map(x => x.id === id ? { ...x, url } : x))
  const removePhoto = (id) => setPhotos(p => p.filter(x => x.id !== id))
  const addPhoto = () => setPhotos(p => [...p, { id: 'w' + Date.now(), url: '', enabled: true }])
  const toggleFeatured = (id) => setFeatured(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])

  return (
    <div className="grid">

      {/* Афиши на главной */}
      <Card
        title="Афиши на главной"
        actions={<Button size="sm" variant="ghost" onClick={addBanner}><IcPlus size={14} /> Добавить афишу</Button>}
      >
        <div className="note small" style={{ marginBottom: 12 }}>
          Рекламные обложки в карусели на главном экране Mini App. Клик по афише ведёт на онлайн-запись.
        </div>
        {banners.map(b => (
          <div
            key={b.id}
            style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr auto auto', gap: 8, alignItems: 'center', marginBottom: 8 }}
          >
            <Select options={BADGES} value={b.badge} onChange={e => updateBanner(b.id, 'badge', e.target.value)} />
            <Input placeholder="Заголовок афиши" value={b.title} onChange={e => updateBanner(b.id, 'title', e.target.value)} />
            <Input placeholder="Подпись" value={b.sub} onChange={e => updateBanner(b.id, 'sub', e.target.value)} />
            <Switch on={b.enabled} onClick={() => toggleBanner(b.id)} />
            <Button size="sm" variant="ghost" onClick={() => removeBanner(b.id)} title="Удалить"><IcTrash size={14} /></Button>
          </div>
        ))}
        {banners.length === 0 && <div className="small muted">Афиш нет. Добавьте первую.</div>}
      </Card>

      {/* Фото работ */}
      <Card
        title="Фото работ на главной"
        actions={<Button size="sm" variant="ghost" onClick={addPhoto}><IcPlus size={14} /> Добавить фото</Button>}
      >
        <div className="note small" style={{ marginBottom: 12 }}>
          Фото работ показываются на главном экране Mini App в блоке «Отзывы и работы» вперемешку с отзывами.
        </div>
        {photos.map(ph => (
          <div
            key={ph.id}
            style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto auto', gap: 10, alignItems: 'center', marginBottom: 8 }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 10, border: '1px solid var(--border)', flexShrink: 0,
              backgroundColor: 'var(--bg-soft, #F1F2F5)',
              backgroundImage: ph.url ? `url(${ph.url})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            }} />
            <Input placeholder="URL фото" value={ph.url} onChange={e => updatePhoto(ph.id, e.target.value)} />
            <Switch on={ph.enabled} onClick={() => togglePhoto(ph.id)} />
            <Button size="sm" variant="ghost" onClick={() => removePhoto(ph.id)} title="Удалить"><IcTrash size={14} /></Button>
          </div>
        ))}
        {photos.length === 0 && <div className="small muted">Фото нет. Добавьте первое.</div>}
      </Card>

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

      {/* Популярные услуги на главной */}
      <Card title="Популярные услуги на главной">
        <div className="note small" style={{ marginBottom: 12 }}>
          Услуги для блока «Популярные» на главном экране Mini App. Выбираются из включённых услуг.
        </div>
        {services.filter(s => s.enabled).map(s => (
          <div className="list-line" key={s.id}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
              <div className="small muted">{s.cat}</div>
            </div>
            <Switch on={featured.includes(s.id)} onClick={() => toggleFeatured(s.id)} />
          </div>
        ))}
      </Card>

      {/* Предоплата / депозит */}
      <Card title="Предоплата (депозит)">
        <div className="list-line" style={{ marginBottom: 8 }}>
          <Switch on={requireDeposit} onClick={() => setRequireDeposit(v => !v)} />
          <div>
            <div style={{ fontWeight: 600 }}>Требовать депозит при записи</div>
            <div className="small muted">Списывается через Telegram Payments и замораживается до визита</div>
          </div>
        </div>
        {requireDeposit && (
          <div className="grid grid-2">
            <Field label="Тип депозита">
              <Select
                value={depositType}
                onChange={e => setDepositType(e.target.value)}
                options={['Фиксированная сумма', 'Процент от стоимости']}
              />
            </Field>
            <Field label={depositType === 'Процент от стоимости' ? 'Процент (%)' : 'Сумма (сум)'}>
              <Input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
            </Field>
          </div>
        )}
      </Card>

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
            <Input placeholder="#3B65F3" defaultValue="#3B65F3" />
          </Field>
          <Field label="Цвет кнопок">
            <Input placeholder="#2C53E6" defaultValue="#2C53E6" />
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

function PreviewTab() {
  const [url, setUrl] = useState('http://localhost:5181/')
  return (
    <div className="grid">
      <div className="note small">
        Это реальный клиентский макет Telegram Mini App (отдельный проект dation-miniapp), встроенный в рамку телефона.
        Если экран пустой — запустите его дев-сервер (в проекте dation-miniapp выполните npm run dev) и укажите адрес ниже.
      </div>

      <div className="toolbar">
        <span className="small muted">Адрес Mini App:</span>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: 320 }} />
        <Button variant="secondary" onClick={() => window.open(url, '_blank', 'noopener')}>Открыть в новой вкладке</Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* Корпус телефона */}
        <div
          style={{
            width: 399,
            background: 'linear-gradient(145deg, #1C1C22, #0A0A0D)',
            borderRadius: 56,
            padding: 12,
            boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 0 2px rgba(255,255,255,0.25)',
          }}
        >
          {/* Экран */}
          <div style={{ position: 'relative', width: 375, height: 780, background: '#fff', borderRadius: 44, overflow: 'hidden' }}>
            {/* Статус-бар */}
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 38, zIndex: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 24px', fontSize: 13, fontWeight: 700, color: '#111', pointerEvents: 'none',
              }}
            >
              <span>9:41</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>5G</span>
                <span style={{ position: 'relative', width: 18, height: 11, border: '1.5px solid #111', borderRadius: 3, display: 'inline-block' }}>
                  <span style={{ position: 'absolute', top: 1.5, left: 1.5, bottom: 1.5, width: 9, background: '#111', borderRadius: 1 }} />
                </span>
              </span>
            </div>
            {/* Динамический остров */}
            <div style={{ position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)', width: 118, height: 30, background: '#000', borderRadius: 16, zIndex: 6 }} />
            {/* Экран приложения (мини-апп во весь экран) */}
            <iframe
              src={url}
              title="Telegram Mini App — предпросмотр"
              style={{ position: 'absolute', top: 38, left: 0, width: 375, height: 742, border: 0, display: 'block' }}
            />
          </div>
        </div>
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
