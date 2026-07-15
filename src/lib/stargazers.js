function toTime(value) {
  return new Date(value).getTime()
}

export function sortRecords(records, column, direction) {
  const sorted = [...records].sort((left, right) => {
    if (column === 'user') {
      return left.login.localeCompare(right.login, 'en', { sensitivity: 'base' })
    }

    if (column === 'registered') {
      return toTime(left.createdAt) - toTime(right.createdAt)
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
