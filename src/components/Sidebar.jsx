import { MENU_ITEMS } from '../lib/constants'
import { cn } from './ui'

export function Sidebar({ activePage, onChange, enabledMap }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="sidebar-kicker">GitHub</p>
        <h1>Starred Report</h1>
      </div>

      <nav className="sidebar-nav" aria-label="Main menu">
        {MENU_ITEMS.map((item) => {
          const enabled = enabledMap[item.id]
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              className={cn('sidebar-link', isActive && 'active')}
              disabled={!enabled}
              onClick={() => enabled && onChange(item.id)}
              type="button"
            >
              <span>{item.label}</span>
              {!enabled && item.id !== 'settings' ? <span className="sidebar-pill">Unavailable</span> : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
