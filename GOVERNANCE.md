# Governance

This document says who decides what, how a decision is recorded, and how a
person can acquire more say than they have today. It describes the project as it
is: **one maintainer, benevolent-dictator model, with the machine gates doing
the work a larger review team would otherwise do.**

## Roles

| Role | Who | What it can do |
| --- | --- | --- |
| Maintainer | the person in [`MAINTAINERS.md`](MAINTAINERS.md) | merge, release, adjudicate the spec, add or remove maintainers |
| Contributor | anyone who opens a pull request | propose anything; own their submission |
| Reporter | anyone who opens an issue | raise a defect, a question, or a spec disagreement |

There is exactly one maintainer. There is no committee, no technical steering
group, and no vote. Saying so plainly is more useful than describing a structure
that does not exist.

## How decisions are made

1. **Ordinary changes** — a form, a gate, a doc fix — are decided by review on
   the pull request. The bar is in [`CONTRIBUTING.md`](CONTRIBUTING.md).
2. **Spec-facing questions** — what a form means, what a silence in a spec
   implies, which convention a fleet-wide rollout adopts — are adjudicated by
   the maintainer and **recorded in the spec** (`spec.md`, `spec/`, or the
   form's `spec/index.md`) in the same pull request that acts on them. A
   decision that lives only in an issue thread, a commit message, or a tool
   session is not a decision this project made.
3. **Disagreement** is resolved by the maintainer, in public, on the issue or
   pull request, with the reason stated. There is no appeal route inside the
   project; the appeal route outside it is a fork, and the licence permits one
   under its terms.

## Principles that outrank preference

These are not up for a vote, because the repository's value is that hundreds of
forms share one design:

- **Uniformity is the product.** A change that improves one form and diverges it
  from the other forms is a regression, not an improvement. Cross-cutting
  changes are designed once on a reference form, then rolled out mechanically to
  all of them.
- **The spec is the source of truth**, and `sql/` is the source of truth for
  every data shape. Spec first, then code, then regenerate, then verify.
- **A rollout ships with the gate that guards it.** Any mechanical change
  applied across the fleet arrives with a `--check` detector, so drift is a
  build failure rather than an archaeology exercise later.
- **No gate is weakened to make something pass.** This is a hard rule, for
  humans and tools alike ([`AI_STATEMENT.md`](AI_STATEMENT.md) §11).

## Becoming a maintainer

The route is open and it is the ordinary one: contribute, sustainedly and well,
until the maintainer invites you. There is no minimum commit count, because a
count is not what is being assessed. What is:

- **Judgement across the fleet.** You have made changes that touched many forms
  at once and got the uniformity right.
- **Gate literacy.** You have written or fixed a `--check` detector, and you
  reach for one by reflex when a rollout needs guarding.
- **Reviewing, not only writing.** You have reviewed others' pull requests
  usefully.
- **Durability.** Months, not weeks.

An invitation is a message, and acceptance is a pull request that adds a row to
[`MAINTAINERS.md`](MAINTAINERS.md), a line to [`CODEOWNERS`](CODEOWNERS), and a
holder to the publishing-identity table where the identity permits one. Those
three edits are the whole mechanism.

## Stepping down, and removal

A maintainer may step down at any time, by a pull request removing their row.
A maintainer may be removed by the sole maintainer for a
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) violation, or for holding access they
no longer use — inactive credentials are a security posture, not a courtesy.
Removal is recorded in the same three places as an addition.

## Releases

The project releases by tagging `main`; there is no release train and no
schedule. The root [`CHANGELOG.md`](CHANGELOG.md) records what changed at the
repository level, and each form carries its own `CHANGELOG.md` under
Keep-a-Changelog and SemVer. Release decisions are the maintainer's and no
tool's.

The mechanics, so a release is a checklist and not an improvisation:

1. All CI jobs green on the candidate commit.
2. Move the root `CHANGELOG.md` `[Unreleased]` content under the new version
   heading with today's date; pick the version by SemVer against the
   repository-level surface (the conventions, the toolchain contracts, the
   per-form layout).
3. Update `NEWS.md` (a Latest entry; refresh the fact sheet's measured
   numbers).
4. Commit, then `git tag -a vX.Y.Z -m "vX.Y.Z"` and push the tag; create the
   GitHub release with the changelog section as its notes.
5. Review `AI_STATEMENT.md` — its §13 ties review to releases.

## Repository settings

The GitHub-side settings are part of governance but live outside the tree, so
this section records what they are meant to be; if the settings and this
section disagree, one of them is wrong and the fix lands as a PR to this file
or a settings change, deliberately.

- **Branch protection on `main`**: require the CI checks that run on every
  push — Structure validation, Drift detectors, SQL apply gate, FHIR R5
  validation, and the Rust and Svelte shards — to pass before merge; no
  force pushes; no branch deletion. With a bus factor of one
  ([`MAINTAINERS.md`](MAINTAINERS.md)), "require pull request reviews" is
  deliberately **not** enabled: there is nobody to review, and pretending
  otherwise would only mean self-approval theatre. The protection that is
  real at this size is the machine gates.
- **Issues**: enabled, with the templates in `.github/ISSUE_TEMPLATE/`
  (defect, clinical correctness, and a private-route pointer for security
  per [`SECURITY.md`](SECURITY.md)).
- **Description and topics**: kept in line with the fact sheet in
  [`NEWS.md`](NEWS.md).
- **Pages**: `build_type: workflow` (GitHub Actions builds and deploys, per
  [`.github/workflows/deploy-formexamples.yml`](.github/workflows/deploy-formexamples.yml))
  — not on by default for a repository; without it the deploy job fails
  with "Get Pages site failed" regardless of how correct the workflow is.
  Enable via Settings → Pages → Build and deployment → Source, or
  `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`.

## Changing this document

By pull request, like everything else. The maintainer decides.
