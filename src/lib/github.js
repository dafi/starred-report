import { STARRED_ACCEPT_HEADER } from './constants'

function parseLastPage(linkHeader) {
  if (!linkHeader) {
    return null
  }

  const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/)
  return match ? Number.parseInt(match[1], 10) : null
}

function normalizeRecord(item) {
  return {
    login: item.user.login,
    htmlUrl: item.user.html_url,
    avatarUrl: item.user.avatar_url ?? '',
    starredAt: item.starred_at,
  }
}

export async function fetchAllStargazers(settings, onProgress) {
  const perPage = 100
  let page = 1
  let totalPages = null
  const records = []

  while (true) {
    const url = new URL(
      `https://api.github.com/repos/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repo)}/stargazers`,
    )
    url.searchParams.set('per_page', String(perPage))
    url.searchParams.set('page', String(page))

    const response = await fetch(url, {
      headers: {
        Accept: STARRED_ACCEPT_HEADER,
        Authorization: `Bearer ${settings.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
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

    if (totalPages === null) {
      totalPages = parseLastPage(response.headers.get('link')) ?? 1
    }

    const pageItems = await response.json()
    records.push(...pageItems.map(normalizeRecord))

    onProgress?.({
      currentPage: page,
      totalPages,
      recordsRead: records.length,
    })

    if (page >= totalPages) {
      break
    }

    if (totalPages === 1 && pageItems.length < perPage) {
      break
    }

    page += 1
  }

  return records
}
