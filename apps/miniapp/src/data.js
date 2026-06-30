// Мок-данные клиентского контура Mini App «Dation»

export const COMPANY = {
  name: 'Студия красоты «Lumière»',
  short: 'L',
  about: 'Запись онлайн · уведомления в Telegram',
}

// Профиль клиента (как будто подтянут из Telegram initData)
export const CLIENT = {
  name: 'Камила Юсупова',
  phone: '+998 90 123 45 67',
  tgUser: '@kamila',
  initials: 'КЮ',
}

// Рекламные обложки на главной
export const BANNERS = [
  { id: 'p1', badge: 'Акция', title: 'Окрашивание −20%', sub: 'Весь июль на сложное окрашивание', grad: 'linear-gradient(135deg,#3B65F3,#5B8DEF)' },
  { id: 'p2', badge: 'Подарок', title: 'Маникюр + педикюр', sub: 'Снятие покрытия бесплатно', grad: 'linear-gradient(135deg,#2C53E6,#DB2777)' },
  { id: 'p3', badge: 'Новинка', title: 'Ламинирование ресниц', sub: 'Эффект на 6–8 недель', grad: 'linear-gradient(135deg,#2C53E6,#3B65F3)' },
  { id: 'p4', badge: 'Приведи друга', title: '−15% вам обоим', sub: 'За каждого приглашённого', grad: 'linear-gradient(135deg,#2C53E6,#3B65F3)' },
]

export const BRANCHES = [
  { id: 'b1', name: 'Филиал на Амира Темура', addr: 'пр. Амира Темура, 15', hours: '09:00–21:00', metro: 'Центр' },
  { id: 'b2', name: 'Филиал в Mirzo Center', addr: 'ул. Шота Руставели, 24', hours: '10:00–22:00', metro: 'Мирзо-Улугбек' },
  { id: 'b3', name: 'Филиал на Чиланзаре', addr: 'Чиланзар, кв. 12, д. 4', hours: '09:00–20:00', metro: 'Чиланзар' },
]

export const CATEGORIES = [
  {
    id: 'hair', name: 'Парикмахерские услуги',
    services: [
      { id: 's1', name: 'Женская стрижка', price: 180000, dur: 60, desc: 'Мытьё, стрижка, укладка' },
      { id: 's2', name: 'Мужская стрижка', price: 120000, dur: 40, desc: 'Стрижка машинкой и ножницами' },
      { id: 's3', name: 'Окрашивание в один тон', price: 350000, dur: 120, desc: 'Краситель и уход в подарок' },
      { id: 's4', name: 'Укладка', price: 90000, dur: 40, desc: 'Локоны или гладкая укладка' },
    ],
  },
  {
    id: 'nails', name: 'Ногтевой сервис',
    services: [
      { id: 's5', name: 'Маникюр с покрытием', price: 150000, dur: 90, desc: 'Аппаратный маникюр + гель-лак' },
      { id: 's6', name: 'Педикюр', price: 200000, dur: 90, desc: 'Классический педикюр' },
      { id: 's7', name: 'Снятие + укрепление', price: 80000, dur: 40, desc: 'Снятие старого покрытия' },
    ],
  },
  {
    id: 'brows', name: 'Брови и ресницы',
    services: [
      { id: 's8', name: 'Коррекция и окрашивание бровей', price: 90000, dur: 40, desc: 'Форма + краска/хна' },
      { id: 's9', name: 'Ламинирование ресниц', price: 220000, dur: 80, desc: 'Подкручивание и уход' },
    ],
  },
]

export const STAFF = [
  { id: 'm0', name: 'Любой свободный', spec: 'Подберём по времени', rating: null, any: true, initials: '?' },
  { id: 'm1', name: 'Дильноза Каримова', spec: 'Стилист-колорист', rating: 4.9, initials: 'ДК', services: ['s1', 's3', 's4'] },
  { id: 'm2', name: 'Азиз Рахимов', spec: 'Барбер', rating: 4.8, initials: 'АР', services: ['s2'] },
  { id: 'm3', name: 'Нигора Саидова', spec: 'Мастер маникюра', rating: 5.0, initials: 'НС', services: ['s5', 's6', 's7'] },
  { id: 'm4', name: 'Сабина Алиева', spec: 'Бровист, лешмейкер', rating: 4.9, initials: 'СА', services: ['s8', 's9'] },
]

// Готовые слоты времени по периодам
export const SLOTS = {
  morning: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  day: ['12:00', '12:30', '13:30', '14:00', '15:00', '15:30'],
  evening: ['16:00', '17:00', '17:30', '18:30', '19:00', '20:00'],
}
// «Занятые» слоты — для реалистичности (недоступны)
export const BUSY = ['10:30', '13:30', '17:00', '19:00']

// Существующие записи клиента (личный кабинет)
export const MY_BOOKINGS = [
  {
    id: 'a1', status: 'upcoming', branch: 'Филиал на Амира Темура',
    date: '2026-07-03', time: '15:00', master: 'Дильноза Каримова',
    services: [{ name: 'Женская стрижка', price: 180000 }, { name: 'Укладка', price: 90000 }],
    total: 270000, dur: 100,
  },
  {
    id: 'a2', status: 'done', branch: 'Филиал на Амира Темура',
    date: '2026-06-12', time: '12:00', master: 'Нигора Саидова',
    services: [{ name: 'Маникюр с покрытием', price: 150000 }],
    total: 150000, dur: 90,
  },
  {
    id: 'a3', status: 'cancelled', branch: 'Филиал в Mirzo Center',
    date: '2026-05-28', time: '18:30', master: 'Сабина Алиева',
    services: [{ name: 'Ламинирование ресниц', price: 220000 }],
    total: 220000, dur: 80,
  },
]

export const PREPAY_AMOUNT = 50000 // фиксированный депозит

// Отзывы клиентов
export const REVIEWS = [
  { id: 'r1', name: 'Камила Ю.', rating: 5, date: '28 июня', text: 'Лучший мастер! Стрижка именно как хотела, приду ещё.' },
  { id: 'r2', name: 'Дилноза А.', rating: 5, date: '25 июня', text: 'Маникюр держится третью неделю, очень аккуратно.' },
  { id: 'r3', name: 'Азиза Р.', rating: 4, date: '21 июня', text: 'Окрашивание получилось мягким и ровным, спасибо!' },
  { id: 'r4', name: 'Нодира К.', rating: 5, date: '18 июня', text: 'Уютно и чисто, мастера — настоящие профессионалы.' },
  { id: 'r5', name: 'Сабина М.', rating: 5, date: '15 июня', text: 'Ламинирование ресниц — эффект просто вау, держится отлично.' },
  { id: 'r6', name: 'Гульнара Т.', rating: 4, date: '12 июня', text: 'Записалась онлайн за минуту, мастер приняла вовремя.' },
  { id: 'r7', name: 'Мадина Х.', rating: 5, date: '8 июня', text: 'Брови привели в идеальную форму, очень довольна.' },
  { id: 'r8', name: 'Лола И.', rating: 5, date: '3 июня', text: 'Приятные цены и внимательное отношение. Рекомендую!' },
]

// Фото работ салона (в реальном приложении — загруженные фото)
export const WORK_PHOTOS = [
  'https://picsum.photos/seed/dation-a/500',
  'https://picsum.photos/seed/dation-b/500',
  'https://picsum.photos/seed/dation-c/500',
  'https://picsum.photos/seed/dation-d/500',
]

// ---------- Хелперы ----------
export const fmtPrice = (n) => n.toLocaleString('ru-RU') + ' сум'
export const fmtDur = (min) => {
  const h = Math.floor(min / 60), m = min % 60
  return (h ? h + ' ч ' : '') + (m ? m + ' мин' : '') || '0 мин'
}

const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const MO = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const MO_FULL = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

// Ближайшие N дней начиная с базовой даты (детерминированно, без Date.now)
export function nextDays(n) {
  const base = new Date(2026, 5, 29) // 29 июня 2026 (текущая дата проекта)
  const out = []
  for (let i = 0; i < n; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      wd: WD[d.getDay()], dd: d.getDate(), mo: MO[d.getMonth()],
      isWeekend: d.getDay() === 0,
    })
  }
  return out
}

export function fmtDateFull(key) {
  if (!key) return ''
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${WD[dt.getDay()]}, ${d} ${MO_FULL[m - 1]}`
}
