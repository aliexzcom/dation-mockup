// Код подключения POS-терминала (как Google Authenticator).
// Детерминированный 4-значный код из номера 5-минутного окна времени.
// ВАЖНО: алгоритм идентичен с POS-терминалом (apps/pos/src/pairing.js),
// поэтому код совпадает в обоих приложениях в пределах одного окна.

export const PAIRING_WINDOW_MS = 5 * 60 * 1000

export function pairingCodeForWindow(win) {
  // классический LCG; числа держим в безопасном диапазоне (< 2^53)
  const x = ((win % 1000000) * 9301 + 49297) % 233280
  return String(Math.floor((x / 233280) * 1000000)).padStart(6, '0')
}

export function currentWindow(now = Date.now()) {
  return Math.floor(now / PAIRING_WINDOW_MS)
}

export function currentPairingCode(now = Date.now()) {
  return pairingCodeForWindow(currentWindow(now))
}

export function msUntilNextWindow(now = Date.now()) {
  return PAIRING_WINDOW_MS - (now % PAIRING_WINDOW_MS)
}
