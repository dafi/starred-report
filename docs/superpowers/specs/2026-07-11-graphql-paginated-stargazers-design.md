# GraphQL paginated stargazers — design

## Context

GitHub changed the REST `GET /repos/{owner}/{repo}/stargazers` endpoint: it now
returns `401 Requires authentication` when unauthenticated and `404 Not Found`
even with a valid token. The GraphQL API still exposes stargazers correctly.
The app must migrate to GraphQL and switch to on-demand pagination.

## Decisions

- **Transport:** GitHub GraphQL API (`POST https://api.github.com/graphql`).
- **Auth:** token is now **required** (GraphQL always needs authentication).
- **Loading model:** lazy, on-demand pagination — one page at a time via a
  "Load more" control. No full prefetch.
- **Ordering:** most recent first (`orderBy: {field: STARRED_AT, direction: DESC}`).
- **Page size:** 100 (GraphQL maximum).
- **Persistence:** in-memory only. No IndexedDB / local storage of records.
- **Charts:** removed entirely.

## Modules

### `src/lib/github.js` (rewrite)
Replace `fetchAllStargazers` with:

```
fetchStargazersPage(settings, cursor) ->
  { records, totalCount, hasNextPage, endCursor }
```

- Sends a GraphQL query with variables `owner`, `repo`, `cursor` (nullable).
- Query selects `totalCount`, `pageInfo { hasNextPage endCursor }`,
  `edges { starredAt node { login url avatarUrl } }`.
- Normalizes each edge to `{ login, htmlUrl, avatarUrl, starredAt }`.
- Throws a clear error when the token is missing, on HTTP non-ok, and on a
  GraphQL `errors[]` payload (surfacing the first message).

### `src/App.jsx`
In-memory state: `records`, `totalCount`, `endCursor`, `hasNextPage`,
`isLoading`, `message`. First "Load stargazers" and subsequent "Load more"
append pages. Changing owner/repo/token resets the list. No IndexedDB effect.

### `src/pages/ShowStarredPage.jsx`
Single data page: existing table (local sort/filter) plus load controls and an
"N of M" counter. Default sort: date DESC.

### `src/lib/settings.js`
`validateSettings` now also requires `token`.

### `src/lib/constants.js`
Menu items reduced to `show` and `settings`. Remove `STARRED_ACCEPT_HEADER`.

## Removals

- `src/pages/ChartsPage.jsx`, `src/pages/ReadStarredPage.jsx`
- `src/lib/storage.js`, `src/lib/selectors.js`
- Chart builders in `stargazers.js` (`buildDailySeries`, `buildCumulativeSeries`,
  `buildWeekdaySeries`); keep `sortRecords`, `filterRecordsByDateRange`.
- `recharts` dependency (if present).

## Tests (TDD)

- `github.test.js`: rewritten for the GraphQL paginated fetch — headers, query
  body, pagination cursor, error handling.
- `settings.test.js`: token now required; drop selector tests.
- `stargazers.test.js`: drop chart-builder tests; keep sort/filter tests.
