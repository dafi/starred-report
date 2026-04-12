import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { ReadStarredPage } from './pages/ReadStarredPage'
import { SettingsPage } from './pages/SettingsPage'
import { ShowStarredPage } from './pages/ShowStarredPage'
import { ChartsPage } from './pages/ChartsPage'
import { fetchAllStargazers } from './lib/github'
import { loadSettings, saveSettings, validateSettings } from './lib/settings'
import { loadDataset, saveDataset } from './lib/storage'
import { hasUsableDataset } from './lib/selectors'

const initialReadStatus = {
  isLoading: false,
  currentPage: 0,
  totalPages: 0,
  recordsRead: 0,
  message: '',
  kind: 'info',
}

export default function App() {
  const [activePage, setActivePage] = useState('settings')
  const [settings, setSettings] = useState(() => loadSettings())
  const [datasetMeta, setDatasetMeta] = useState(null)
  const [records, setRecords] = useState([])
  const [readStatus, setReadStatus] = useState(initialReadStatus)

  useEffect(() => {
    loadDataset()
      .then((dataset) => {
        setDatasetMeta(dataset.meta)
        setRecords(dataset.records)
      })
      .catch(() => {
        setReadStatus((current) => ({
          ...current,
          message: 'Could not load local browser data.',
          kind: 'error',
        }))
      })
  }, [])

  const settingsReady = validateSettings(settings)
  const datasetReady = hasUsableDataset(datasetMeta, settings, records)

  const enabledMap = useMemo(
    () => ({
      read: settingsReady,
      show: settingsReady && datasetReady,
      charts: settingsReady && datasetReady,
      settings: true,
    }),
    [datasetReady, settingsReady],
  )

  useEffect(() => {
    if (!enabledMap[activePage]) {
      setActivePage('settings')
    }
  }, [activePage, enabledMap])

  function handleSaveSettings(nextSettings) {
    saveSettings(nextSettings)
    setSettings(nextSettings)
  }

  async function handleReadStarred() {
    if (readStatus.isLoading) {
      return
    }

    setReadStatus({
      isLoading: true,
      currentPage: 0,
      totalPages: 0,
      recordsRead: 0,
      message: '',
      kind: 'info',
    })

    try {
      const nextRecords = await fetchAllStargazers(settings, (progress) => {
        setReadStatus((current) => ({
          ...current,
          currentPage: progress.currentPage,
          totalPages: progress.totalPages,
          recordsRead: progress.recordsRead,
        }))
      })

      const meta = {
        owner: settings.owner,
        repo: settings.repo,
        fetchedAt: new Date().toISOString(),
        count: nextRecords.length,
      }

      await saveDataset(meta, nextRecords)
      setDatasetMeta(meta)
      setRecords(nextRecords)
      setActivePage('show')
      setReadStatus({
        isLoading: false,
        currentPage: 0,
        totalPages: 0,
        recordsRead: nextRecords.length,
        message: `Stored ${nextRecords.length} stargazers for ${settings.owner}/${settings.repo}.`,
        kind: 'success',
      })
    } catch (error) {
      setReadStatus({
        isLoading: false,
        currentPage: 0,
        totalPages: 0,
        recordsRead: 0,
        message: error.message || 'Could not read stargazers from GitHub.',
        kind: 'error',
      })
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onChange={setActivePage} enabledMap={enabledMap} />

      <main className="content">
        {activePage === 'settings' ? <SettingsPage settings={settings} onSave={handleSaveSettings} /> : null}
        {activePage === 'read' ? <ReadStarredPage settings={settings} status={readStatus} onRead={handleReadStarred} /> : null}
        {activePage === 'show' ? <ShowStarredPage records={records} /> : null}
        {activePage === 'charts' ? <ChartsPage records={records} /> : null}
      </main>
    </div>
  )
}
