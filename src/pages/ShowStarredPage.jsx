import { useMemo, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpDown, ArrowUpNarrowWide } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Table } from '../components/ui'
import { filterRecordsByDateRange, sortRecords } from '../lib/stargazers'

export function ShowStarredPage({ records }) {
  const [sortColumn, setSortColumn] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const visibleRecords = useMemo(() => {
    const filtered = filterRecordsByDateRange(records, startDate, endDate)
    return sortRecords(filtered, sortColumn, sortDirection)
  }, [records, sortColumn, sortDirection, startDate, endDate])

  function toggleSort(column) {
    if (sortColumn === column) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortColumn(column)
    setSortDirection('asc')
  }

  function renderSortIcon(column) {
    if (sortColumn !== column) {
      return <ArrowUpDown className="sort-column-icon" aria-hidden="true" />
    }

    if (sortDirection === 'asc') {
      return <ArrowUpNarrowWide className="sort-column-icon" aria-hidden="true" />
    }

    return <ArrowDownWideNarrow className="sort-column-icon" aria-hidden="true" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Show Starred</CardTitle>
        <CardDescription>Review stargazers by date and user, with local sorting and filtering.</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="startDate">Start date</label>
            <Input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="endDate">End date</label>
            <Input id="endDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
        </div>

        {visibleRecords.length ? (
          <div className="table-wrap">
            <Table>
              <thead>
                <tr>
                  <th className={sortColumn === 'date' ? 'active-sort-column' : ''}>
                    <button
                      type="button"
                      className="table-sort-trigger"
                      onClick={() => toggleSort('date')}
                      aria-label={`Sort by date ${sortColumn === 'date' && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                    >
                      <span>Date</span>
                      {renderSortIcon('date')}
                    </button>
                  </th>
                  <th className={sortColumn === 'user' ? 'active-sort-column' : ''}>
                    <button
                      type="button"
                      className="table-sort-trigger"
                      onClick={() => toggleSort('user')}
                      aria-label={`Sort by user ${sortColumn === 'user' && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                    >
                      <span>User</span>
                      {renderSortIcon('user')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <tr key={`${record.login}-${record.starredAt}`}>
                    <td>{new Date(record.starredAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td>
                      <a href={record.htmlUrl} target="_blank" rel="noreferrer">
                        {record.login}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No stargazers in this date range.</h3>
            <p>Adjust the start or end date to widen the result set.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
