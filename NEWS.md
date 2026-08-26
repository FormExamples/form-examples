# News

Project news, release notes for readers rather than for `git log`, and the
information a journalist or an analyst needs to write about this project
accurately.

For the engineering-level record, see [`CHANGELOG.md`](CHANGELOG.md); for the
per-form record, each `forms/<slug>/CHANGELOG.md`.

## Latest

### 2026-08-26 — v1.0.0, the first tagged release

The repository cut its first release. v1.0.0 marks the point where the
355-form fleet is uniformly built, every verify gate is green and
CI-enforced, the public-repo document set is complete, and the release
process itself is written down (GOVERNANCE.md). The version number is a
statement about the *repository-level* surface — the conventions, the
toolchain contracts, the per-form layout; individual forms keep their own
CHANGELOGs and versions. Release notes: the `[1.0.0]` section of
[CHANGELOG.md](CHANGELOG.md).

### 2026-08 — Repository documentation set completed

The repository gained the full set of public-repository documents: an
[AI statement](AI_STATEMENT.md) disclosing how AI tooling is used to build this
software and what it is not permitted to do, a [security policy](SECURITY.md),
a [governance](GOVERNANCE.md) document, a [maintainers](MAINTAINERS.md) roster
that is blunt about a bus factor of one, plus
[install](INSTALL.md), [comparisons](COMPARISONS.md), and
[benchmarks](BENCHMARKS.md).

### 2026-08 — Every back end moved to loco-rs 1.0.1

All 355 Rust back-end crates migrated from loco-rs 0.16 to 1.0.1 in a single
mechanical pass, including the `i32` → `i64` primary-key change that 1.0's
`BIGINT` keys require. Two schema-fidelity defects were closed at the same time:
column defaults and column nullability now match each form's `sql/`, its source
of truth, and both are guarded by drift detectors that fail CI rather than warn.

The nullability one is worth stating plainly, because it is the kind of bug a
uniform fleet either has everywhere or nowhere: Loco has no nullable-unique
column type, so nullable UNIQUE columns such as an NHS number had been forced to
`NOT NULL UNIQUE` — which admits exactly one row without the identifier, the
rest colliding on the empty string. Uniqueness is now expressed as an explicit
unique index.

### 2026-08 — Five new forms at full-stack depth

Cataract diagnostic evaluation, health screening questionnaire, hernia
diagnostic evaluation, hip replacement surgery evaluation, and knee replacement
surgery evaluation each shipped complete: spec, SQL schema, generated
representations, both front-ends, and a back-end crate.

## Earlier milestones

| When | What |
| --- | --- |
| 2026-07 | Route layouts settled for both stacks; the SQL apply gate landed; every HTML front-end converted to ES modules |
| 2026-06 | Every back end converged on one design — Loco + SeaORM + PostgreSQL, JSON API |
| 2026-05 | The Lily Design System contract rolled out across every front-end; `formexamples.com` went live |
| 2026-04 | The generator pipeline: SQL as the source of truth, everything else derived |
| 2026-03 | First commit |

## Project fact sheet

Figures below are measured from the repository, not estimated. They are current
as of 2026-08-26 and will drift; `bin/forms-as-kebab-case | wc -l` is the
authoritative count of forms at any commit.

| | |
| --- | --- |
| Forms | 355 |
| Per form | 1 SQL schema, 4 generated representations, 2 front-ends, 1 back-end crate |
| SQL migrations | 3,428 files |
| Generated representations | 2,493 XML + DTD pairs, 2,313 FHIR R5 resources, 2,313 Protocol Buffers schemas, and an OpenAPI 3.1 specification per entity |
| Front-ends | 355 HTML, 355 SvelteKit |
| Back-end crates | 355 (Rust, axum + Loco, JSON API) |
| Toolchain | 69 tools under `bin/`, most with a `--check` drift gate |
| Tracked files | ~146,000 |
| Started | 2026-03-13 |
| Licence | CC BY-NC-SA 4.0 — see [`LICENSE.md`](LICENSE.md) |

## Boilerplate

Short, for a paragraph at the end of an article:

> Form Examples is an open repository of several hundred medical and
> administrative forms, each published as a complete worked stack: a PostgreSQL
> schema, generated XML, FHIR R5, Protocol Buffers, and OpenAPI representations,
> two front-end implementations, and a Rust JSON API. It is maintained by Joel
> Parker Henderson and published under CC BY-NC-SA 4.0 at
> [formexamples.com](https://formexamples.com).

## Accuracy notes for anyone writing about this

The project would rather be described precisely than favourably. Four points
that reporting tends to get wrong:

- **These are examples, not approved clinical instruments.** No form here has
  been clinically validated, trialled, or approved for use in care. Where a form
  implements a published score, the score's authors are the source and the
  implementation is this project's.
- **Nothing here holds patient data.** Every example, persona, and fixture is
  synthetic. This is a structural property of the repository, checkable against
  the tree.
- **No form calls an AI model at runtime.** The scoring engines are
  deterministic arithmetic. AI tooling is used to *build* the repository, which
  is disclosed in detail in [`AI_STATEMENT.md`](AI_STATEMENT.md).
- **It is one maintainer, not a team or a company.** See
  [`MAINTAINERS.md`](MAINTAINERS.md), which says so at some length.

## Contact

| For | Contact |
| --- | --- |
| Press and media enquiries | Joel Parker Henderson, <joel@joelparkerhenderson.com> |
| Security reports | <joel@joelparkerhenderson.com> — read [`SECURITY.md`](SECURITY.md) first, and do not open a public issue |
| Everything else | the issue tracker on [GitHub](https://github.com/FormExamples/form-examples) |

There is no press office and no embargo desk; enquiries go to the maintainer
directly, and a reply within a few days is the realistic expectation.

## Following along

- **GitHub** — <https://github.com/FormExamples/form-examples> (watch releases)
- **Codeberg mirror** — <https://codeberg.org/formexamples/form-examples>
- **GitLab mirror** — <https://gitlab.com/formexamples/form-examples>
- **Site** — <https://formexamples.com>
