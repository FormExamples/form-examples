# Special files for public repos

Status: **implemented** as of 2026-08-26.

This spec lists the files a public repository is expected to carry at its top
level, and records where each one lives here. Every file below is
hand-maintained: none is generated, and there is no `--check` gate for them.
When one changes, it changes in the same pull request as the practice it
describes.

## The files

| File | Purpose | Status |
| --- | --- | --- |
| [`README.md`](../../README.md) | entry point; a symlink to `index.md` so GitHub renders it | present |
| [`LICENSE.md`](../../LICENSE.md) | licence, with SPDX identification (`CC-BY-NC-SA-4.0`) and the third-party works included here | present |
| [`CITATION.cff`](../../CITATION.cff) | citation metadata, with ORCID, for Joel Parker Henderson (<joel@joelparkerhenderson.com>) | present |
| [`NEWS.md`](../../NEWS.md) | news, update information, project fact sheet, press contact | present |
| [`COMPARISONS.md`](../../COMPARISONS.md) | comparisons to relevant projects, and when one of them is the better choice | present |
| [`BENCHMARKS.md`](../../BENCHMARKS.md) | measured benchmarks, speed tests, optimization profile, and what is not measured | present |
| [`INSTALL.md`](../../INSTALL.md) | how to install and run the software | present |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | how a person can contribute time, code, or money | present |
| [`CODEOWNERS`](../../CODEOWNERS) | review ownership per path, with <joel@joelparkerhenderson.com> | present |
| [`MAINTAINERS.md`](../../MAINTAINERS.md) | roster, publishing identities, access continuity; sole maintainer | present |
| [`GOVERNANCE.md`](../../GOVERNANCE.md) | who decides what, how decisions are recorded, how to become a maintainer | present |
| [`SECURITY.md`](../../SECURITY.md) | scope, supported versions, private reporting route, response commitments | present |
| [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) | expected conduct and enforcement | present |
| [`CHANGELOG.md`](../../CHANGELOG.md) | repository-level change history, Keep a Changelog 1.1.0 + SemVer | present |
| [`AI_STATEMENT.md`](../../AI_STATEMENT.md) | how AI tooling is used to build this, what it may and may not do — including the standing, maintainer-granted authority to decide a release is ready and publish a crate — and the limits | present |

Two scopes for the change log, deliberately: the root `CHANGELOG.md` records
repository-level change, and each form carries its own
`forms/<slug>/CHANGELOG.md` for that form's schema, engine, and front-ends.

## Rules these files follow

- **Top-level markdown**, except `CODEOWNERS`, which GitHub reads without an
  extension.
- **[Oxford spelling](../oxford-spelling/oxford-spelling.md)**, as with all
  prose in this repository.
- **Every claim is checkable.** Counts, timings, and licence statements are
  measured or cited, not estimated. Where something is unmeasured, unaudited, or
  weak, it is stated rather than omitted — `BENCHMARKS.md` has a "not measured"
  section, `MAINTAINERS.md` names a bus factor of one, and `COMPARISONS.md` has
  a section on where this repository is weaker.
- **Cross-links resolve.** These documents reference each other heavily; a
  renamed file means a broken set.

## Templates

- [`AI_STATEMENT.md`](AI_STATEMENT.md) in this directory is the template the
  root statement was adapted from, kept for provenance. The root
  [`AI_STATEMENT.md`](../../AI_STATEMENT.md) is the canonical, repository-
  specific one; the template's references to another project's stack (openEHR
  specifications, an MIT licence, a tracker issue) do not apply here.
- `MAINTAINERS.md` follows the structure of
  <https://github.com/rubentalstra/FerroEHR/blob/develop/MAINTAINERS.md>.
- `CITATION.cff` follows the structure of the Assertables crate's `CITATION.cff`.

## Review

Reviewed at every major or minor release, and whenever a claim in one of them
stops being true. `AI_STATEMENT.md` carries its own version and change log in
Annex A.
