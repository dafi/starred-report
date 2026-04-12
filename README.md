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

- reads all stargazers for a GitHub repository
- stores the fetched dataset locally in your browser
- shows the results in a sortable/filterable table
- shows a few simple charts from the saved local dataset
- works with public repositories
- optionally accepts a GitHub token to reduce rate-limit pain

## Why It Exists

Because I wanted the data and did not want to earn it.

That is the entire architecture document.

## Screens / Flow

1. Set `owner` and `repo`
2. Optionally add a GitHub token
3. Fetch all stargazers
4. Browse them locally
5. Look at a couple of charts

## Tech

- React
- Vite
- local browser storage
- GitHub REST API

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

## Token Or No Token?

For public repositories, the app can work without a token.

The token is optional and mainly helps with GitHub API rate limits. If you are doing one small fetch on a public repo, you may not need it. If you keep hammering the API like consequences are for other people, it can help.

## Data Storage

Fetched data is stored in local browser storage on the machine and browser profile you used.

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
