import { PAGE_SIZE } from './constants'

const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql'

const STARGAZERS_QUERY = `query($owner: String!, $repo: String!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    stargazers(first: ${PAGE_SIZE}, after: $cursor, orderBy: { field: STARRED_AT, direction: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        starredAt
        node {
          login
          url
          avatarUrl
          createdAt
        }
      }
    }
  }
}`

function normalizeEdge(edge) {
  return {
    login: edge.node.login,
    htmlUrl: edge.node.url,
    avatarUrl: edge.node.avatarUrl ?? '',
    starredAt: edge.starredAt,
    createdAt: edge.node.createdAt,
  }
}

export async function fetchStargazersPage(settings, cursor) {
  if (!settings.token) {
    throw new Error('A GitHub token is required to read stargazers.')
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: STARGAZERS_QUERY,
      variables: {
        owner: settings.owner,
        repo: settings.repo,
        cursor: cursor ?? null,
      },
    }),
  })

  if (!response.ok) {
    let message = `GitHub request failed with status ${response.status}.`
    try {
      const errorData = await response.json()
      if (errorData.message) {
        message = errorData.message
      }
    } catch {
      // Ignore JSON parsing errors on failure responses.
    }
    throw new Error(message)
  }

  const payload = await response.json()

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message)
  }

  const stargazers = payload.data.repository.stargazers

  return {
    records: stargazers.edges.map(normalizeEdge),
    totalCount: stargazers.totalCount,
    hasNextPage: stargazers.pageInfo.hasNextPage,
    endCursor: stargazers.pageInfo.endCursor,
  }
}
