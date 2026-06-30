import { useState } from 'react'
import { PageHead, Button, Card, Tabs, Badge, Table, Field, Input, Textarea, Select, Switch, Drawer, KV } from '../components/ui.jsx'
import { ServicePicker } from '../components/ServicePicker.jsx'
import { IcPlus, IcExport, IcEdit, IcTrash } from '../components/icons.jsx'

// --- Мок-данные ---
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Волосы', parent: null },
  { id: 2, name: 'Стрижки', parent: 1 },
  { id: 3, name: 'Окрашивание', parent: 1 },
  { id: 4, name: 'Уходы для волос', parent: 1 },
  { id: 5, name: 'Ногти', parent: null },
  { id: 6, name: 'Маникюр', parent: 5 },
  { id: 7, name: 'Педикюр', parent: 5 },
  { id: 8, name: 'Косметология', parent: null },
  { id: 9, name: 'Чистки', parent: 8 },
  { id: 10, name: 'Пилинги', parent: 8 },
]

const INITIAL_SERVICES = [
  { id: 1, name: 'Женская стрижка', cat: 'Стрижки', catId: 2, price: '2 000–3 500 ₽', duration: 60, buffer: 10, miniapp: true, skill: 'Парикмахер', vat: false },
  { id: 2, name: 'Мужская стрижка', cat: 'Стрижки', catId: 2, price: '1 200–1 800 ₽', duration: 45, buffer: 5, miniapp: true, skill: 'Барбер', vat: false },
  { id: 3, name: 'Стрижка бороды', cat: 'Стрижки', catId: 2, price: '800 ₽', duration: 30, buffer: 5, miniapp: true, skill: 'Барбер', vat: false },
  { id: 4, name: 'Окрашивание в один тон', cat: 'Окрашивание', catId: 3, price: '4 500–8 000 ₽', duration: 120, buffer: 15, miniapp: true, skill: 'Колорист', vat: false },
  { id: 5, name: 'Балаяж / Омбре', cat: 'Окрашивание', catId: 3, price: '7 000–14 000 ₽', duration: 180, buffer: 20, miniapp: true, skill: 'Колорист', vat: false },
  { id: 6, name: 'Ламинирование волос', cat: 'Уходы для волос', catId: 4, price: '3 000 ₽', duration: 90, buffer: 10, miniapp: false, skill: 'Парикмахер', vat: false },
  { id: 7, name: 'Маникюр классический', cat: 'Маникюр', catId: 6, price: '1 500 ₽', duration: 60, buffer: 10, miniapp: true, skill: 'Мастер ногтей', vat: false },
  { id: 8, name: 'Маникюр + покрытие гель-лак', cat: 'Маникюр', catId: 6, price: '2 200 ₽', duration: 90, buffer: 10, miniapp: true, skill: 'Мастер ногтей', vat: false },
  { id: 9, name: 'Наращивание ногтей', cat: 'Маникюр', catId: 6, price: '4 500–5 500 ₽', duration: 120, buffer: 15, miniapp: false, skill: 'Мастер ногтей', vat: false },
  { id: 10, name: 'Педикюр классический', cat: 'Педикюр', catId: 7, price: '2 500 ₽', duration: 90, buffer: 10, miniapp: true, skill: 'Мастер ногтей', vat: false },
  { id: 11, name: 'Чистка лица аппаратная', cat: 'Чистки', catId: 9, price: '3 500 ₽', duration: 60, buffer: 15, miniapp: true, skill: 'Косметолог', vat: true },
  { id: 12, name: 'Химический пилинг', cat: 'Пилинги', catId: 10, price: '4 000 ₽', duration: 45, buffer: 15, miniapp: false, skill: 'Косметолог', vat: true },
]

const INITIAL_PACKAGES = [
  {
    id: 1,
    name: 'Пакет «Полный образ»',
    services: ['Женская стрижка', 'Маникюр + покрытие гель-лак'],
    price: '3 900 ₽',
    discount: '8%',
    miniapp: true,
  },
  {
    id: 2,
    name: 'Пакет «Уход для кожи»',
    services: ['Чистка лица аппаратная', 'Химический пилинг'],
    price: '6 800 ₽',
    discount: '10%',
    miniapp: false,
  },
]

const EMPTY_PACKAGE = { name: '', services: [], price: '', discount: '', miniapp: true }

const STAFF_PRICES = [
  { staff: 'Анна Морозова', price: '2 500 ₽', commission: '35%' },
  { staff: 'Игорь Лебедев', price: '2 000 ₽', commission: '30%' },
  { staff: 'Светлана Котова', price: '2 200 ₽', commission: '35%' },
]

const EMPTY_SERVICE = {
  name: '',
  cat: 'Выберите категорию',
  description: '',
}

const EMPTY_CATEGORY = {
  name: '',
  parent: 'Без родителя (корневая)',
  description: '',
}

// --- Утилиты ---
function formatDur(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}

// --- Drawer услуги ---
function ServiceDrawer({ service, open, onClose, isNew, onSave }) {
  const [miniApp, setMiniApp] = useState(service ? service.miniapp : true)
  const [vatOn, setVatOn] = useState(service ? service.vat : false)
  const [form, setForm] = useState(EMPTY_SERVICE)

  // Сбрасываем форму при открытии нового drawer
  // (для просмотра/редактирования существующей — используем данные service)
  function handleSave() {
    if (!form.name.trim()) return
    // Услуга — это каталожная позиция сети. Цена и длительность задаются у мастера.
    onSave({
      id: Date.now(),
      name: form.name.trim(),
      cat: form.cat !== 'Выберите категорию' ? form.cat : '—',
      catId: null,
      price: '—',
      duration: 0,
      buffer: 0,
      miniapp: miniApp,
      vat: vatOn,
    })
    setForm(EMPTY_SERVICE)
    setMiniApp(true)
    setVatOn(false)
  }

  function handleClose() {
    setForm(EMPTY_SERVICE)
    setMiniApp(true)
    setVatOn(false)
    onClose()
  }

  const title = isNew ? 'Новая услуга' : (service ? service.name : 'Услуга')

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <div style={{ flex: 1 }} />
          <Button onClick={isNew ? handleSave : onClose}>Сохранить</Button>
        </div>
      }
    >
      {isNew ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="note small">
            Услуга создаётся на уровне сети и автоматически появляется во всех филиалах.
            Цена и длительность задаются у каждого мастера во вкладке «Услуги и цены».
          </div>
          <Field label="Название услуги">
            <Input
              placeholder="Например: Женская стрижка"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Категория">
            <Select
              options={['Выберите категорию', 'Стрижки', 'Окрашивание', 'Уходы для волос', 'Маникюр', 'Педикюр', 'Чистки', 'Пилинги']}
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
            />
          </Field>
          <Field label="Описание">
            <Textarea
              placeholder="Краткое описание для клиента..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Switch on={vatOn} onClick={() => setVatOn(!vatOn)} />
            <span>Включить НДС в стоимость</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Switch on={miniApp} onClick={() => setMiniApp(!miniApp)} />
            <span>Доступна в Mini App (запись онлайн)</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Название услуги">
            <Input placeholder="Например: Женская стрижка" defaultValue={service ? service.name : ''} />
          </Field>
          <Field label="Категория">
            <Select options={['Выберите категорию', 'Стрижки', 'Окрашивание', 'Уходы для волос', 'Маникюр', 'Педикюр', 'Чистки', 'Пилинги']} />
          </Field>
          <Field label="Описание">
            <Textarea placeholder="Краткое описание для клиента..." />
          </Field>

          <div className="note small">
            Цена и длительность услуги задаются индивидуально для каждого мастера.
          </div>
          <div className="section-title">Цена по сотрудникам</div>
          <Table
            columns={[{ label: 'Сотрудник' }, { label: 'Цена', num: true }, { label: '% мастера', num: true }]}
            rows={STAFF_PRICES}
            renderRow={(r, i) => (
              <tr key={i}>
                <td>{r.staff}</td>
                <td className="num"><Input defaultValue={r.price} style={{ width: 90, textAlign: 'right' }} /></td>
                <td className="num"><Input defaultValue={r.commission} style={{ width: 70, textAlign: 'right' }} /></td>
              </tr>
            )}
          />


          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Switch on={vatOn} onClick={() => setVatOn(!vatOn)} />
            <span>Включить НДС в стоимость</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Switch on={miniApp} onClick={() => setMiniApp(!miniApp)} />
            <span>Доступна в Mini App (запись онлайн)</span>
          </div>

          <Field label="Изображение услуги">
            <Button variant="secondary" size="sm">Загрузить изображение</Button>
          </Field>
        </div>
      )}
    </Drawer>
  )
}

// --- Drawer категории ---
function CategoryDrawer({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_CATEGORY)

  function handleSave() {
    if (!form.name.trim()) return
    onSave({ ...form })
    setForm(EMPTY_CATEGORY)
  }

  function handleClose() {
    setForm(EMPTY_CATEGORY)
    onClose()
  }

  return (
    <Drawer
      title="Новая категория"
      open={open}
      onClose={handleClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Название категории">
          <Input
            placeholder="Например: Брови и ресницы"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Родительская категория">
          <Select
            options={['Без родителя (корневая)', 'Волосы', 'Ногти', 'Косметология']}
            value={form.parent}
            onChange={(e) => setForm({ ...form, parent: e.target.value })}
          />
        </Field>
        <Field label="Описание">
          <Textarea
            placeholder="Необязательно..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
      </div>
    </Drawer>
  )
}

// Сопоставление маршрута раздела и подписи вкладки
const VIEW_TABS = {
  list: 'Список услуг',
  categories: 'Категории',
  pricing: 'Прайс-лист',
  packages: 'Пакеты услуг',
}

// --- Главная страница ---
// view: 'list' | 'categories' | 'pricing' | 'packages' — раздел приходит из меню (маршрута).
// Если view не задан (уровень бизнеса) — показываем вкладки внутри страницы.
export default function Services({ business = false, view = null }) {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [tab, setTab] = useState('Список услуг')
  const activeTab = view ? VIEW_TABS[view] : tab
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [newServiceOpen, setNewServiceOpen] = useState(false)
  const [newCatOpen, setNewCatOpen] = useState(false)
  const [packages, setPackages] = useState(INITIAL_PACKAGES)
  const [newPkgOpen, setNewPkgOpen] = useState(false)

  function handleSavePackage(newPkg) {
    setPackages([newPkg, ...packages])
    setNewPkgOpen(false)
  }

  const rootCats = categories.filter((c) => c.parent === null)
  const childCats = (parentId) => categories.filter((c) => c.parent === parentId)

  const visibleServices = selectedCat
    ? services.filter((s) => s.catId === selectedCat)
    : services

  function handleSaveService(newService) {
    setServices([newService, ...services])
    setNewServiceOpen(false)
  }

  function handleSaveCategory(form) {
    const parentCat = categories.find((c) => c.name === form.parent)
    const newCat = {
      id: Date.now(),
      name: form.name.trim(),
      parent: parentCat ? parentCat.id : null,
    }
    setCategories([...categories, newCat])
    setNewCatOpen(false)
  }

  return (
    <>
      <PageHead
        crumbs="Услуги"
        title="Услуги"
        sub={business
          ? 'Каталог услуг сети. Услуга, созданная здесь, автоматически появляется во всех филиалах.'
          : 'Каталог услуг, прайс-лист и пакеты.'}
        actions={
          <Button variant="ghost" size="sm"><IcExport size={16} /> Импорт прайса</Button>
        }
      />

      {!view && (
        <Tabs
          tabs={['Список услуг', 'Категории', 'Прайс-лист', 'Пакеты услуг']}
          active={tab}
          onChange={setTab}
        />
      )}

      {activeTab === 'Список услуг' && (
        <div style={{ marginTop: 16 }}>
          <div className="toolbar">
            <Select
              options={['Все категории', ...categories.map((c) => c.name)]}
              style={{ width: 220 }}
              onChange={(e) => {
                const c = categories.find((x) => x.name === e.target.value)
                setSelectedCat(c ? c.id : null)
              }}
            />
            <div className="spacer" />
            {business && <Button size="sm" onClick={() => setNewServiceOpen(true)}><IcPlus size={16} /> Услуга</Button>}
          </div>
          <Card pad={false}>
            <Table
              columns={[
                { label: 'Название' },
                { label: 'Категория' },
                { label: 'Цена', num: true },
                { label: 'Длительность', num: true },
                { label: 'Mini App' },
                { label: 'Действия' },
              ]}
              rows={visibleServices}
              renderRow={(r, i) => (
                <tr key={i}>
                  <td>
                    <span
                      style={{ cursor: 'pointer', fontWeight: 500 }}
                      onClick={() => setSelectedService(r)}
                    >
                      {r.name}
                    </span>
                    {r.vat && <span className="tag" style={{ marginLeft: 6 }}>НДС</span>}
                  </td>
                  <td>{r.cat}</td>
                  <td className="num">{r.price}</td>
                  <td className="num">{r.duration ? formatDur(r.duration) : '—'}</td>
                  <td>
                    {r.miniapp
                      ? <Badge color="green">Да</Badge>
                      : <Badge color="gray">Нет</Badge>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedService(r)}>
                        <IcEdit size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </Card>
        </div>
      )}

      {activeTab === 'Категории' && (
        <div style={{ marginTop: 16 }}>
          <Card
            title="Категории услуг"
            actions={business ? <Button size="sm" onClick={() => setNewCatOpen(true)}><IcPlus size={14} /> Категория</Button> : undefined}
          >
            {rootCats.map((rc) => (
              <div key={rc.id}>
                <div className="list-line" style={{ fontWeight: 600 }}>
                  <span style={{ flex: 1 }}>{rc.name}</span>
                  <span className="small faint">{childCats(rc.id).length} подкатегорий</span>
                  <Button variant="ghost" size="sm"><IcEdit size={14} /></Button>
                  <Button variant="ghost" size="sm"><IcTrash size={14} /></Button>
                </div>
                {childCats(rc.id).map((cc) => (
                  <div key={cc.id} className="list-line" style={{ paddingLeft: 20 }}>
                    <span style={{ flex: 1 }} className="muted">{cc.name}</span>
                    <span className="small faint">{services.filter((s) => s.catId === cc.id).length} услуг</span>
                    <Button variant="ghost" size="sm"><IcEdit size={14} /></Button>
                    <Button variant="ghost" size="sm"><IcTrash size={14} /></Button>
                  </div>
                ))}
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === 'Прайс-лист' && (
        <div style={{ marginTop: 16 }}>
          {rootCats.map((rc) => {
            const catIds = [rc.id, ...childCats(rc.id).map((c) => c.id)]
            const catServices = services.filter((s) => catIds.includes(s.catId))
            if (catServices.length === 0) return null
            return (
              <Card key={rc.id} title={rc.name} style={{ marginBottom: 16 }} pad={false}>
                <Table
                  columns={[
                    { label: 'Услуга' },
                    { label: 'Подкатегория' },
                    { label: 'Цена', num: true },
                    { label: 'Длительность', num: true },
                  ]}
                  rows={catServices}
                  renderRow={(r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.cat}</td>
                      <td className="num">{r.price}</td>
                      <td className="num">{r.duration ? formatDur(r.duration) : '—'}</td>
                    </tr>
                  )}
                />
              </Card>
            )
          })}
        </div>
      )}

      {activeTab === 'Пакеты услуг' && (
        <div style={{ marginTop: 16 }}>
          {business && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <Button size="sm" onClick={() => setNewPkgOpen(true)}><IcPlus size={16} /> Новый пакет</Button>
            </div>
          )}
          <div className="grid grid-2" style={{ gap: 16 }}>
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                title={pkg.name}
                actions={
                  <>
                    <Button variant="ghost" size="sm"><IcEdit size={14} /></Button>
                    <Button variant="ghost" size="sm"><IcTrash size={14} /></Button>
                  </>
                }
              >
                <KV items={[
                  ['Входящие услуги', pkg.services.join(', ')],
                  ['Итоговая цена', pkg.price],
                  ['Скидка пакета', pkg.discount],
                  ['Доступен в Mini App', pkg.miniapp ? 'Да' : 'Нет'],
                ]} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Drawer редактирования/просмотра услуги */}
      <ServiceDrawer
        service={selectedService}
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        isNew={false}
        onSave={() => setSelectedService(null)}
      />

      {/* Drawer новой услуги */}
      <ServiceDrawer
        service={null}
        open={newServiceOpen}
        onClose={() => setNewServiceOpen(false)}
        isNew={true}
        onSave={handleSaveService}
      />

      {/* Drawer новой категории */}
      <CategoryDrawer
        open={newCatOpen}
        onClose={() => setNewCatOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* Drawer нового пакета */}
      <PackageDrawer
        open={newPkgOpen}
        onClose={() => setNewPkgOpen(false)}
        onSave={handleSavePackage}
      />
    </>
  )
}

// --- Drawer пакета услуг ---
function PackageDrawer({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_PACKAGE)
  const [miniapp, setMiniapp] = useState(true)

  function handleSave() {
    if (!form.name.trim()) return
    onSave({
      id: Date.now(),
      name: form.name.trim(),
      services: form.services,
      price: form.price || '—',
      discount: form.discount || '0%',
      miniapp,
    })
    setForm(EMPTY_PACKAGE)
    setMiniapp(true)
  }

  function handleClose() {
    setForm(EMPTY_PACKAGE)
    setMiniapp(true)
    onClose()
  }

  return (
    <Drawer
      title="Новый пакет"
      open={open}
      onClose={handleClose}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      }
    >
      <Field label="Название пакета">
        <Input placeholder="Например: Пакет «Полный образ»" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Входящие услуги">
        <ServicePicker
          options={INITIAL_SERVICES.map((s) => ({ name: s.name, price: s.price }))}
          value={form.services}
          onChange={(arr) => setForm({ ...form, services: arr })}
        />
      </Field>
      <div className="grid grid-2">
        <Field label="Итоговая цена"><Input placeholder="3 900 ₽" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
        <Field label="Скидка пакета"><Input placeholder="8%" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></Field>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Switch on={miniapp} onClick={() => setMiniapp(!miniapp)} />
        <span>Доступен в Mini App (запись онлайн)</span>
      </div>
    </Drawer>
  )
}
