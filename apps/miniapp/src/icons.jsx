// Линейные SVG-иконки (без эмодзи), наследуют currentColor.
const S = ({ children, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

export const IcBack = (p) => <S {...p}><path d="m15 18-6-6 6-6" /></S>
export const IcHome = (p) => <S {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></S>
export const IcCheck = (p) => <S {...p}><path d="M20 6 9 17l-5-5" /></S>
export const IcCalendar = (p) => <S {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></S>
export const IcClock = (p) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>
export const IcUser = (p) => <S {...p}><circle cx="12" cy="8" r="3.4" /><path d="M5 21a7 7 0 0 1 14 0" /></S>
export const IcPin = (p) => <S {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></S>
export const IcScissors = (p) => <S {...p}><circle cx="6" cy="6" r="2.6" /><circle cx="6" cy="18" r="2.6" /><path d="M8 8l12 8M8 16 20 8" /></S>
export const IcStar = (p) => <S {...p}><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 17.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z" fill="currentColor" stroke="none" /></S>
export const IcChevR = (p) => <S {...p}><path d="m9 6 6 6-6 6" /></S>
export const IcClose = (p) => <S {...p}><path d="M18 6 6 18M6 6l12 12" /></S>
export const IcMoon = (p) => <S {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></S>
export const IcSun = (p) => <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></S>
export const IcCalCheck = (p) => <S {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></S>
export const IcPhone = (p) => <S {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2Z" /></S>
export const IcMenu = (p) => <S {...p}><path d="M4 6h16M4 12h16M4 18h16" /></S>
export const IcGear = (p) => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></S>
export const IcArrowUpRight = (p) => <S {...p}><path d="M7 17 17 7M8 7h9v9" /></S>
export const IcSend = (p) => <S {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></S>
export const IcSearch = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></S>
