function toTime(value) {
  return new Date(value).getTime()
}

export function sortRecords(records, column, direction) {
  const sorted = [...records].sort((left, right) => {
    if (column === 'user') {
      return left.login.localeCompare(right.login, 'en', { sensitivity: 'base' })
    }

    return toTime(left.starredAt) - toTime(right.starredAt)
  })

  return direction === 'asc' ? sorted : sorted.reverse()
}

export function filterRecordsByDateRange(records, startDate, endDate) {
  const start = startDate ? new Date(`${startDate}T00:00:00Z`).getTime() : null
  const end = endDate ? new Date(`${endDate}T23:59:59.999Z`).getTime() : null

  return records.filter((record) => {
    const current = toTime(record.starredAt)

    if (start !== null && current < start) {
      return false
    }

    if (end !== null && current > end) {
      return false
    }

    return true
  })
}

export function buildDailySeries(records) {
  const map = new Map()

  records.forEach((record) => {
    const day = record.starredAt.slice(0, 10)
    map.set(day, (map.get(day) ?? 0) + 1)
  })

  return [...map.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([date, count]) => ({ date, count }))
}

export function buildCumulativeSeries(records) {
  let total = 0
  return buildDailySeries(records).map((item) => {
    total += item.count
    return {
      date: item.date,
      count: total,
    }
  })
}

export function buildWeekdaySeries(records) {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = labels.map((label) => ({ label, count: 0 }))

  records.forEach((record) => {
    const dayIndex = new Date(record.starredAt).getUTCDay()
    counts[dayIndex].count += 1
  })

  return counts
}
