function getBounds(series) {
  const values = series.map((item) => item.count)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  return { min, max }
}

export function LineChart({ title, series }) {
  if (!series.length) {
    return (
      <div className="chart-empty">
        <h3>{title}</h3>
        <p>Not enough data for this chart.</p>
      </div>
    )
  }

  const width = 640
  const height = 220
  const padding = 24
  const { min, max } = getBounds(series)
  const range = max - min || 1

  const points = series
    .map((item, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(series.length - 1, 1)
      const y = height - padding - ((item.count - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <p>{series.length} points</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label={title}>
        <polyline fill="none" stroke="currentColor" strokeWidth="3" points={points} />
      </svg>
      <div className="chart-footer">
        <span>{series[0].date}</span>
        <span>{series[series.length - 1].date}</span>
      </div>
    </div>
  )
}

export function BarChart({ title, series }) {
  if (!series.length || !series.some((item) => item.count > 0)) {
    return (
      <div className="chart-empty">
        <h3>{title}</h3>
        <p>Not enough data for this chart.</p>
      </div>
    )
  }

  const max = Math.max(...series.map((item) => item.count), 1)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <p>{series.reduce((sum, item) => sum + item.count, 0)} total</p>
      </div>
      <div className="bar-chart">
        {series.map((item) => (
          <div key={item.label} className="bar-chart-item">
            <div className="bar-chart-bar-wrap">
              <div className="bar-chart-bar" style={{ height: `${(item.count / max) * 100}%` }} />
            </div>
            <span className="bar-chart-label">{item.label}</span>
            <span className="bar-chart-value">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
