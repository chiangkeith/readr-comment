import { UNIT, } from 'src/constants'

export function dateDiffFromNow (date) {
  const d1 = Math.floor(Date.parse(date) / 1000)
  const d2 = Math.floor(Date.now() / 1000)
  const diff = d2 - d1
  const hour = Math.floor(diff / 3600)
  const min = Math.floor((diff - hour * 3600) / 60)
  const sec = diff - hour * 3600 - min * 60
  const day = Math.floor(hour / 24)
  if (day !== 0) {
    return updatedAtYYYYMMDD(date)
  } else if (hour !== 0) {
    return `${hour} ${UNIT.HOUR}`
  } else if (min !== 0) {
    return `${min} ${UNIT.MINUTE}`
  } else if (sec !== 0) {
    return `${sec} ${UNIT.SECOND}`
  } else {
    return UNIT.JUST
  }
}
export function updatedAtYYYYMMDD (isoDate) {
  if (!isoDate) return isoDate
  const date = isoDate.split('T')[0]
  return date.replace(/-/g, '/')
}