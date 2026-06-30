// Мок-данные POS-терминала «Dation»

export const COMPANY = {
  name: 'Студия красоты «Lumière»',
  short: 'L',
}

// Филиалы заведения (терминал привязан к одному, можно переключать)
export const BRANCHES = [
  { id: 'b1', name: 'Филиал на Амира Темура', addr: 'пр. Амира Темура, 15' },
  { id: 'b2', name: 'Филиал в Mirzo Center', addr: 'ул. Шота Руставели, 24' },
  { id: 'b3', name: 'Филиал на Чиланзаре', addr: 'Чиланзар, кв. 12, д. 4' },
]

// Сотрудники. posAccess=true — есть доступ к POS-терминалу (видны на экране выбора профиля).
// pin — код входа под профиль (мок).
export const STAFF = [
  { id: 'u1', name: 'Дильноза Каримова', role: 'Администратор', initials: 'ДК', color: '#7C3AED', pin: '1111', posAccess: true },
  { id: 'u2', name: 'Азиз Рахимов', role: 'Барбер', initials: 'АР', color: '#2563EB', pin: '2222', posAccess: true },
  { id: 'u3', name: 'Нигора Саидова', role: 'Мастер маникюра', initials: 'НС', color: '#DB2777', pin: '3333', posAccess: true },
  { id: 'u4', name: 'Сабина Алиева', role: 'Бровист, лешмейкер', initials: 'СА', color: '#16A34A', pin: '4444', posAccess: true },
  { id: 'u5', name: 'Мадина Юсупова', role: 'Стажёр', initials: 'МЮ', color: '#D97706', pin: '5555', posAccess: false },
]

export const SERVICES = [
  { id: 's1', name: 'Женская стрижка', price: 180000, dur: 60 },
  { id: 's2', name: 'Мужская стрижка', price: 120000, dur: 40 },
  { id: 's3', name: 'Окрашивание в один тон', price: 350000, dur: 120 },
  { id: 's4', name: 'Укладка', price: 90000, dur: 40 },
  { id: 's5', name: 'Маникюр с покрытием', price: 150000, dur: 90 },
  { id: 's6', name: 'Педикюр', price: 200000, dur: 90 },
  { id: 's8', name: 'Коррекция и окрашивание бровей', price: 90000, dur: 40 },
  { id: 's9', name: 'Ламинирование ресниц', price: 220000, dur: 80 },
]

// Статусы записи
export const STATUS = {
  booked: { label: 'Запланирована', cls: 'blue' },
  in_progress: { label: 'В работе', cls: 'amber' },
  done: { label: 'Оказана · к оплате', cls: 'violet' },
  paid: { label: 'Оплачена', cls: 'green' },
  cancelled: { label: 'Отменена', cls: 'gray' },
}

// Записи на сегодня (подтянуты из веб-аппа)
export const TODAY_APPOINTMENTS = [
  { id: 'a1', time: '09:30', client: { name: 'Камила Юсупова', phone: '+998 90 123 45 67' }, masterId: 'u1', source: 'Mini App',
    services: [{ id: 's1', name: 'Женская стрижка', price: 180000 }, { id: 's4', name: 'Укладка', price: 90000 }], status: 'paid' },
  { id: 'a2', time: '10:30', client: { name: 'Рустам Ибрагимов', phone: '+998 91 234 56 78' }, masterId: 'u2', source: 'Телефон',
    services: [{ id: 's2', name: 'Мужская стрижка', price: 120000 }], status: 'in_progress' },
  { id: 'a3', time: '11:30', client: { name: 'Севара Алимова', phone: '+998 93 345 67 89' }, masterId: 'u3', source: 'Mini App',
    services: [{ id: 's5', name: 'Маникюр с покрытием', price: 150000 }], status: 'done' },
  { id: 'a4', time: '13:00', client: { name: 'Дилфуза Каримова', phone: '+998 94 456 78 90' }, masterId: 'u4', source: 'Mini App',
    services: [{ id: 's9', name: 'Ламинирование ресниц', price: 220000 }], status: 'booked' },
  { id: 'a5', time: '14:30', client: { name: 'Жасур Тошматов', phone: '+998 97 567 89 01' }, masterId: 'u2', source: 'Повторная',
    services: [{ id: 's2', name: 'Мужская стрижка', price: 120000 }], status: 'booked' },
  { id: 'a6', time: '16:00', client: { name: 'Малика Рашидова', phone: '+998 99 678 90 12' }, masterId: 'u3', source: 'Mini App',
    services: [{ id: 's5', name: 'Маникюр с покрытием', price: 150000 }, { id: 's6', name: 'Педикюр', price: 200000 }], status: 'booked' },
  { id: 'a7', time: '17:30', client: { name: 'Гульнора Хасанова', phone: '+998 90 789 01 23' }, masterId: 'u4', source: 'Телефон',
    services: [{ id: 's8', name: 'Коррекция и окрашивание бровей', price: 90000 }], status: 'cancelled' },
]

export const PAY_METHODS = [
  { id: 'cash', label: 'Наличные', icon: 'cash' },
  { id: 'card', label: 'Карта', icon: 'card' },
  { id: 'payme', label: 'Payme', icon: 'wallet' },
  { id: 'click', label: 'Click', icon: 'wallet' },
]

// ---------- Хелперы ----------
export const fmtPrice = (n) => n.toLocaleString('ru-RU') + ' сум'
export const fmtDur = (min) => {
  const h = Math.floor(min / 60), m = min % 60
  return (h ? h + ' ч ' : '') + (m ? m + ' мин' : '') || '0 мин'
}
export const sumServices = (svcs) => svcs.reduce((s, x) => s + x.price, 0)
export const staffById = (id) => STAFF.find((s) => s.id === id)
