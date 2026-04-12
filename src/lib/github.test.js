import { fetchAllStargazers } from './github'

describe('fetchAllStargazers', () => {
  test('aggregates all pages and reports progress', async () => {
    const progress = []

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => '<https://api.github.com/repositories/1/stargazers?per_page=100&page=2>; rel="last"',
        },
        json: async () => [
          {
            starred_at: '2024-01-01T10:00:00Z',
            user: { login: 'alice', html_url: 'https://github.com/alice', avatar_url: 'https://img/a' },
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => null,
        },
        json: async () => [
          {
            starred_at: '2024-01-02T10:00:00Z',
            user: { login: 'bob', html_url: 'https://github.com/bob', avatar_url: 'https://img/b' },
          },
        ],
      })

    const result = await fetchAllStargazers({ owner: 'o', repo: 'r', token: 't' }, (item) => progress.push(item))

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      login: 'alice',
      htmlUrl: 'https://github.com/alice',
      avatarUrl: 'https://img/a',
      starredAt: '2024-01-01T10:00:00Z',
    })
    expect(progress).toEqual([
      { currentPage: 1, totalPages: 2, recordsRead: 1 },
      { currentPage: 2, totalPages: 2, recordsRead: 2 },
    ])
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      expect.any(URL),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: expect.any(String),
          Authorization: 'Bearer t',
          'X-GitHub-Api-Version': '2022-11-28',
        }),
      }),
    )
  })

  test('surfaces GitHub errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: 'Forbidden' }),
    })

    await expect(fetchAllStargazers({ owner: 'o', repo: 'r', token: 't' })).rejects.toThrow('Forbidden')
  })

  test('omits Authorization header when token is empty', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => null,
      },
      json: async () => [],
    })

    await fetchAllStargazers({ owner: 'o', repo: 'r', token: '' })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        headers: {
          Accept: expect.any(String),
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }),
    )
  })
})
