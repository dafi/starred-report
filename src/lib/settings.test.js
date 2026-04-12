import { validateSettings } from './settings'
import { datasetMatchesSettings, hasUsableDataset } from './selectors'

describe('settings selectors', () => {
  test('validateSettings requires owner repo and token', () => {
    expect(validateSettings({ owner: 'o', repo: 'r', token: 't' })).toBe(true)
    expect(validateSettings({ owner: 'o', repo: '', token: 't' })).toBe(false)
  })

  test('dataset state only enables pages for the matching repo', () => {
    const meta = { owner: 'openai', repo: 'sdk' }
    const records = [{ login: 'alice', starredAt: '2024-01-01T00:00:00Z' }]

    expect(datasetMatchesSettings(meta, { owner: 'openai', repo: 'sdk', token: 'x' })).toBe(true)
    expect(hasUsableDataset(meta, { owner: 'openai', repo: 'sdk', token: 'x' }, records)).toBe(true)
    expect(hasUsableDataset(meta, { owner: 'openai', repo: 'other', token: 'x' }, records)).toBe(false)
  })
})
