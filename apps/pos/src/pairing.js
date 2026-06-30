// Код подключения терминала — идентичный алгоритм с веб-кабинетом
// (apps/admin/src/pairing.js). Код совпадает в обоих приложениях в пределах
// одного 5-минутного окна времени, поэтому ввод кода с веба реально проходит.

export const PAIRING_WINDOW_MS = 5 * 60 * 1000

export function pairingCodeForWindow(win) {
  const x = ((win % 1000000) * 9301 + 49297) % 233280
  return String(Math.floor((x / 233280) * 1000000)).padStart(6, '0')
}

export function currentWindow(now = Date.now()) {
  return Math.floor(now / PAIRING_WINDOW_MS)
}

export function currentPairingCode(now = Date.now()) {
  return pairingCodeForWindow(currentWindow(now))
}

// Принимаем код текущего окна (и предыдущего — на случай ввода у границы окна).
export function isPairingCodeValid(code, now = Date.now()) {
  const w = currentWindow(now)
  return code === pairingCodeForWindow(w) || code === pairingCodeForWindow(w - 1)
}
