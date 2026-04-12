import { useMemo, useState } from 'react'
import { BarChart, LineChart } from '../components/charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '../components/ui'
import { buildCumulativeSeries, buildDailySeries, buildWeekdaySeries, filterRecordsByDateRange } from '../lib/stargazers'

export function ChartsPage({ records }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredRecords = useMemo(() => filterRecordsByDateRange(records, startDate, endDate), [records, startDate, endDate])
  const dailySeries = useMemo(() => buildDailySeries(filteredRecords), [filteredRecords])
  const cumulativeSeries = useMemo(() => buildCumulativeSeries(filteredRecords), [filteredRecords])
  const weekdaySeries = useMemo(() => buildWeekdaySeries(filteredRecords), [filteredRecords])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charts</CardTitle>
        <CardDescription>Explore daily, cumulative, and weekday stargazer trends from local browser data.</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <div className="toolbar">
          <div className="field">
            <label htmlFor="chartStartDate">Start date</label>
            <Input
              id="chartStartDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="chartEndDate">End date</label>
            <Input id="chartEndDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
        </div>

        <div className="chart-grid">
          <LineChart title="Daily stars trend" series={dailySeries} />
          <LineChart title="Cumulative stars" series={cumulativeSeries} />
          <BarChart title="Weekday distribution" series={weekdaySeries} />
        </div>
      </CardContent>
    </Card>
  )
}
