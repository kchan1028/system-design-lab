# Contributing

Open an issue to discuss scope, then propose a small pull request from a topic branch. Do not push changes directly to main. Run tests, lint, build, and browser checks before requesting review.

Write original designs using synthetic examples. State requirements, exclusions, assumptions, alternatives, failure modes, and unresolved questions. Separate target service levels from observed measurements. Do not include credentials, personal documents, proprietary architecture, or unsupported performance claims.

Keep content review separate from foundation changes. Include accessible text descriptions alongside diagrams. Test navigation by keyboard and at phone width. Automated accessibility checks do not replace assistive-technology review.

No project license has been approved; contributors should resolve contribution terms with the owner before submitting substantial external contributions.

## Continuous integration

| Workflow | Runs on | Checks |
|---|---|---|
| [CI](.github/workflows/ci.yml) `check` | Pull requests and pushes to main | `npm ci`, Vitest, oxlint, TypeScript check and production build with prerendering, Playwright navigation, layout and axe checks |
| [CI](.github/workflows/ci.yml) `dependency-review` | Pull requests | Fails if the PR adds a dependency with a known high or critical vulnerability |
| [Publish documentation](.github/workflows/pages.yml) | Pushes to main | The same checks as `check`, then deploys `dist/` to GitHub Pages. Only the deploy job has Pages and OIDC write access |

Workflows use read-only repository access by default, pinned action commits and no secrets. A newer push to a pull request cancels the older CI run. [Dependabot](.github/dependabot.yml) opens update PRs for npm packages and actions.
