# starred-report

Tiny web app to read the stargazers of a GitHub repository, save them locally in the browser, and inspect them with a table plus a few charts.

## Important Disclaimer

This is pure vibe coding.

Not "carefully engineered side project". Not "production-ready utility". Just a small toy built because doing things properly sounded exhausting and this was faster.

Treat it accordingly:

- it is a toy
- it is local-first and browser-only
- it was made to scratch one very specific itch
- it may be useful
- it is not something I would recommend trusting blindly

If it breaks, gets rate-limited, or behaves weirdly on edge cases, that is not a shocking betrayal of the original design vision. It is the design vision.

## What It Does

- reads stargazers for a GitHub repository, one page at a time, most recent first
- keeps the loaded pages in memory for the current session
- shows the results in a sortable/filterable table
- works with public repositories
- requires a GitHub token (the GraphQL API always needs authentication)

## Why It Exists

Because I wanted the data and did not want to earn it.

That is the entire architecture document.

## Screens / Flow

1. Set `owner`, `repo`, and a GitHub token
2. Load the first page of stargazers
3. Keep hitting "Load more" for older pages
4. Browse them in the table

## Tech

- React
- Vite
- in-memory session state
- GitHub GraphQL API

No backend. No database. No operational burden. No dignity.

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open the local Vite URL in your browser.

## Test

```bash
pnpm test
```

## Token

A token is required. GitHub's GraphQL API always needs authentication, and the
old unauthenticated REST stargazers endpoint no longer works for this.

A classic token with **no scopes** is enough — it only reads public stargazer
data. Generate one at github.com/settings/tokens and paste it into Settings.

## Data Storage

Loaded pages live only in memory for the current session. Reload the page and
you start over.

That is convenient, which is another way of saying "good enough for the kind of questionable life choices that produced this repository."

## Non-Goals

- production hardening
- multi-user support
- backend sync
- auth flows
- polished error handling
- enterprise anything
- impressing serious people

## License

No license has been added yet. If you want to reuse it, add one first instead of pretending this README is a legally binding emotional understanding.
