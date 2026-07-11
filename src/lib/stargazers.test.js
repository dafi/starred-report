import { filterRecordsByDateRange, sortRecords } from './stargazers'

const records = [
  { login: 'c', starredAt: '2024-01-03T09:00:00Z' },
  { login: 'a', starredAt: '2024-01-01T09:00:00Z' },
  { login: 'b', starredAt: '2024-01-01T11:00:00Z' },
]

describe('stargazer selectors', () => {
  test('sorts ascending and descending by date', () => {
    expect(sortRecords(records, 'date', 'asc').map((item) => item.login)).toEqual(['a', 'b', 'c'])
    expect(sortRecords(records, 'date', 'desc').map((item) => item.login)).toEqual(['c', 'b', 'a'])
  })

  test('sorts ascending and descending by user', () => {
    expect(sortRecords(records, 'user', 'asc').map((item) => item.login)).toEqual(['a', 'b', 'c'])
    expect(sortRecords(records, 'user', 'desc').map((item) => item.login)).toEqual(['c', 'b', 'a'])
  })

  test('filters by inclusive date range', () => {
    const result = filterRecordsByDateRange(records, '2024-01-01', '2024-01-01')
    expect(result).toHaveLength(2)
  })
})
