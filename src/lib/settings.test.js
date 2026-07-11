import { validateSettings } from './settings'

describe('validateSettings', () => {
  test('requires owner, repo, and token', () => {
    expect(validateSettings({ owner: 'o', repo: 'r', token: 't' })).toBe(true)
    expect(validateSettings({ owner: 'o', repo: 'r', token: '' })).toBe(false)
    expect(validateSettings({ owner: 'o', repo: '', token: 't' })).toBe(false)
    expect(validateSettings({ owner: '', repo: 'r', token: 't' })).toBe(false)
  })
})
