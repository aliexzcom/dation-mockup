// Простые линейные SVG-иконки (без эмодзи). Наследуют currentColor.
const S = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

export const IcCalendar = (p) => <S {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></S>
export const IcTelegram = (p) => <S {...p}><path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15Z"/></S>
export const IcUsers = (p) => <S {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-4-5.6"/></S>
export const IcScissors = (p) => <S {...p}><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8 8l12 8M8 16 20 8"/></S>
export const IcStaff = (p) => <S {...p}><circle cx="12" cy="7" r="3.4"/><path d="M5 21a7 7 0 0 1 14 0"/></S>
export const IcMoney = (p) => <S {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/></S>
export const IcBox = (p) => <S {...p}><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></S>
export const IcBell = (p) => <S {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/></S>
export const IcChart = (p) => <S {...p}><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 4-5"/></S>
export const IcGear = (p) => <S {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></S>
export const IcBranch = (p) => <S {...p}><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-5h6v5"/><path d="M9 10h.01M15 10h.01"/></S>
export const IcCard = (p) => <S {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></S>
export const IcSearch = (p) => <S {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></S>
export const IcPlus = (p) => <S {...p}><path d="M12 5v14M5 12h14"/></S>
export const IcChevron = (p) => <S {...p}><path d="m6 9 6 6 6-6"/></S>
export const IcClose = (p) => <S {...p}><path d="M18 6 6 18M6 6l12 12"/></S>
export const IcArrowL = (p) => <S {...p}><path d="m15 18-6-6 6-6"/></S>
export const IcArrowR = (p) => <S {...p}><path d="m9 6 6 6-6 6"/></S>
export const IcMenu = (p) => <S {...p}><path d="M4 6h16M4 12h16M4 18h16"/></S>
export const IcFilter = (p) => <S {...p}><path d="M3 5h18l-7 8v6l-4-2v-4Z"/></S>
export const IcExport = (p) => <S {...p}><path d="M12 3v12M8 7l4-4 4 4"/><path d="M4 17v3h16v-3"/></S>
export const IcEdit = (p) => <S {...p}><path d="M4 20h4L20 8l-4-4L4 16v4Z"/><path d="M14 6l4 4"/></S>
export const IcTrash = (p) => <S {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></S>
export const IcLogout = (p) => <S {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></S>
export const IcClock = (p) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></S>
export const IcMoon = (p) => <S {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></S>
export const IcSun = (p) => <S {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></S>

export const NAV_ICONS = {
  journal: IcCalendar, miniapp: IcTelegram, clients: IcUsers, services: IcScissors,
  staff: IcStaff, finance: IcMoney, inventory: IcBox, notifications: IcBell,
  analytics: IcChart, settings: IcGear, branches: IcBranch, billing: IcCard,
}
