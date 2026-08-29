# Dependabot

Status: **implemented** as of 2026-08-29.

Enable GitHub Dependabot dependabot_security_updates at the repo level. 

Enable GitHub Dependabot .github/dependabot.yml for scheduled update PRs.

## Implementation

- **Dependabot alerts + automated security fixes**, at the repo level: not a
  file, a GitHub repository setting. Verified both were off before this
  (`vulnerability-alerts` 404'd; `automated-security-fixes` returned
  `{"enabled":false}`), then enabled both directly via the GitHub REST API
  (`PUT /repos/{owner}/{repo}/vulnerability-alerts`,
  `PUT /repos/{owner}/{repo}/automated-security-fixes`) and confirmed the
  change with a follow-up `GET` on each. Dependabot alerts are a
  prerequisite for automated security-fix PRs to actually fire, so both
  were enabled together even though the spec names only the second.
  GitHub-specific: the Codeberg and GitLab mirrors have no equivalent
  concept and are out of scope.
- **[`.github/dependabot.yml`](../../.github/dependabot.yml)**: already
  present (GitHub Actions, and the two npm projects — the documentation
  site and the E2E harness — weekly). The 355-crate/front-end fleet is
  deliberately excluded, with the reasoning recorded in the file itself:
  Dependabot cannot reason about a fleet that must move in lockstep, so
  those are updated by deliberate fleet-wide sweeps instead, per
  `AGENTS.md`.
