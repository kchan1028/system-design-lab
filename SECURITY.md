# Security policy

This is a static documentation site, with no authentication, uploads, backend, analytics, or document processing. Do not submit private documents or secrets in issues or pull requests.

Report suspected vulnerabilities privately through this repository's Security → Report a vulnerability feature when available. If unavailable, use the contact route on https://kalunchan.dev and request a private reporting channel before sharing details. No response-time guarantee is claimed.

Only repository-maintained Markdown and Mermaid sources are supported. Raw Markdown HTML is disabled; Mermaid uses strict mode. The diagram SVG insertion remains a trust boundary: do not accept runtime visitor content. Dependencies and hosting configuration require review before deployment.

CI uses read-only repository access, no deployment secrets, and no pull_request_target execution. Repository administrators should require the CI check and reviewed PRs on main, disable force pushes/deletion, enable private vulnerability reporting, and enable dependency alerts. These settings must be verified on GitHub; this file does not configure them.
