import { fetchStargazersPage } from './github'

function mockGraphqlResponse(data) {
  return {
    ok: true,
    json: async () => ({ data }),
  }
}

const pageData = {
  repository: {
    stargazers: {
      totalCount: 2,
      pageInfo: { hasNextPage: true, endCursor: 'CURSOR_1' },
      edges: [
        {
          starredAt: '2024-01-02T10:00:00Z',
          node: {
            login: 'bob',
            url: 'https://github.com/bob',
            avatarUrl: 'https://img/b',
            createdAt: '2020-05-06T08:00:00Z',
          },
        },
      ],
    },
  },
}

describe('fetchStargazersPage', () => {
  test('requests a GraphQL page and normalizes the edges', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockGraphqlResponse(pageData))

    const result = await fetchStargazersPage({ owner: 'o', repo: 'r', token: 't' }, null)

    expect(result).toEqual({
      records: [
        {
          login: 'bob',
          htmlUrl: 'https://github.com/bob',
          avatarUrl: 'https://img/b',
          starredAt: '2024-01-02T10:00:00Z',
          createdAt: '2020-05-06T08:00:00Z',
        },
      ],
      totalCount: 2,
      hasNextPage: true,
      endCursor: 'CURSOR_1',
    })

    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toBe('https://api.github.com/graphql')
    expect(options.method).toBe('POST')
    expect(options.headers.Authorization).toBe('Bearer t')
    expect(options.headers['Content-Type']).toBe('application/json')

    const body = JSON.parse(options.body)
    expect(body.query).toContain('stargazers')
    expect(body.query).toContain('STARRED_AT')
    expect(body.query).toContain('DESC')
    expect(body.variables).toEqual({ owner: 'o', repo: 'r', cursor: null })
  })

  test('passes the cursor for subsequent pages', async () => {
    global.fetch = vi.fn().mockResolvedValue(mockGraphqlResponse(pageData))

    await fetchStargazersPage({ owner: 'o', repo: 'r', token: 't' }, 'CURSOR_1')

    const body = JSON.parse(global.fetch.mock.calls[0][1].body)
    expect(body.variables.cursor).toBe('CURSOR_1')
  })

  test('throws a clear error when the token is missing', async () => {
    global.fetch = vi.fn()

    await expect(fetchStargazersPage({ owner: 'o', repo: 'r', token: '' }, null)).rejects.toThrow(/token/i)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('surfaces GraphQL errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ errors: [{ message: 'Could not resolve to a Repository' }] }),
    })

    await expect(fetchStargazersPage({ owner: 'o', repo: 'r', token: 't' }, null)).rejects.toThrow(
      'Could not resolve to a Repository',
    )
  })

  test('surfaces HTTP errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Bad credentials' }),
    })

    await expect(fetchStargazersPage({ owner: 'o', repo: 'r', token: 't' }, null)).rejects.toThrow('Bad credentials')
  })
})
