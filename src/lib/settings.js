const SETTINGS_KEY = 'starred-report:settings'

export function validateSettings(settings) {
  return Boolean(settings.owner && settings.repo)
}

export function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) {
      return { owner: '', repo: '', token: '' }
    }

    const parsed = JSON.parse(raw)
    return {
      owner: parsed.owner ?? '',
      repo: parsed.repo ?? '',
      token: parsed.token ?? '',
    }
  } catch {
    return { owner: '', repo: '', token: '' }
  }
}

export function saveSettings(settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
