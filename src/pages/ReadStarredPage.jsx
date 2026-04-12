import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from '../components/ui'

export function ReadStarredPage({ settings, status, onRead }) {
  const hasProgress = status.totalPages > 0
  const percentage = hasProgress ? (status.currentPage / status.totalPages) * 100 : status.isLoading ? 15 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Read Starred</CardTitle>
        <CardDescription>Fetch all stargazers for the configured GitHub repository and store them locally.</CardDescription>
      </CardHeader>
      <CardContent className="stack">
        <div className="summary-box">
          <p className="summary-label">Current repository</p>
          <p className="summary-value">
            {settings.owner}/{settings.repo}
          </p>
        </div>

        <Button type="button" onClick={onRead} disabled={status.isLoading}>
          {status.isLoading ? 'Reading stargazers...' : 'Read all stargazers'}
        </Button>

        <div className="stack">
          <Progress value={percentage} />
          <p className="progress-text">
            {status.isLoading && hasProgress
              ? `Pages read: ${status.currentPage}/${status.totalPages}`
              : status.isLoading
                ? 'Preparing request...'
                : 'No active read operation.'}
          </p>
          <p className="progress-text">Stargazers collected: {status.recordsRead}</p>
        </div>

        {status.message ? <p className={`status-message ${status.kind}`}>{status.message}</p> : null}
      </CardContent>
    </Card>
  )
}
