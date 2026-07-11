import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { SettingsPage } from './pages/SettingsPage'
import { ShowStarredPage } from './pages/ShowStarredPage'
import { fetchStargazersPage } from './lib/github'
import { loadSettings, saveSettings, validateSettings } from './lib/settings'

const initialLoadState = {
  records: [],
  totalCount: 0,
  endCursor: null,
  hasNextPage: false,
  hasLoaded: false,
  isLoading: false,
  message: '',
  kind: 'info',
}

export default function App() {
  const [activePage, setActivePage] = useState('settings')
  const [settings, setSettings] = useState(() => loadSettings())
  const [loadState, setLoadState] = useState(initialLoadState)

  const settingsReady = validateSettings(settings)

  const enabledMap = useMemo(
    () => ({
      show: settingsReady,
      settings: true,
    }),
    [settingsReady],
  )

  useEffect(() => {
    if (!enabledMap[activePage]) {
      setActivePage('settings')
    }
  }, [activePage, enabledMap])

  function handleSaveSettings(nextSettings) {
    saveSettings(nextSettings)
    setSettings(nextSettings)
    // A new target repository invalidates whatever we loaded in memory.
    setLoadState(initialLoadState)
  }

  async function loadPage(cursor) {
    if (loadState.isLoading) {
      return
    }

    setLoadState((current) => ({ ...current, isLoading: true, message: '', kind: 'info' }))

    try {
      const page = await fetchStargazersPage(settings, cursor)

      setLoadState((current) => {
        const records = cursor ? [...current.records, ...page.records] : page.records
        return {
          records,
          totalCount: page.totalCount,
          endCursor: page.endCursor,
          hasNextPage: page.hasNextPage,
          hasLoaded: true,
          isLoading: false,
          message: `Loaded ${records.length} of ${page.totalCount} stargazers.`,
          kind: 'success',
        }
      })
    } catch (error) {
      setLoadState((current) => ({
        ...current,
        isLoading: false,
        message: error.message || 'Could not read stargazers from GitHub.',
        kind: 'error',
      }))
    }
  }

  function handleLoadFirst() {
    loadPage(null)
  }

  function handleLoadMore() {
    loadPage(loadState.endCursor)
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onChange={setActivePage} enabledMap={enabledMap} />

      <main className="content">
        {activePage === 'settings' ? <SettingsPage settings={settings} onSave={handleSaveSettings} /> : null}
        {activePage === 'show' ? (
          <ShowStarredPage
            settings={settings}
            loadState={loadState}
            onLoadFirst={handleLoadFirst}
            onLoadMore={handleLoadMore}
          />
        ) : null}
      </main>
    </div>
  )
}
