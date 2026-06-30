// Узбекский формат номера: +998 90 123 45 67
export function formatUzbPhone(input) {
  let d = input.replace(/\D/g, '')
  if (d.startsWith('998')) d = d.slice(3)
  d = d.slice(0, 9) // 2 цифры кода оператора + 7 цифр номера
  let out = '+998'
  if (d.length) out += ' ' + d.slice(0, 2)
  if (d.length > 2) out += ' ' + d.slice(2, 5)
  if (d.length > 5) out += ' ' + d.slice(5, 7)
  if (d.length > 7) out += ' ' + d.slice(7, 9)
  return out
}

export function isUzbPhoneValid(value) {
  let d = value.replace(/\D/g, '')
  if (d.startsWith('998')) d = d.slice(3)
  return d.length === 9
}
