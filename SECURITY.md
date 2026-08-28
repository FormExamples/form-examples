# Security policy

## What this repository is, in security terms

This repository is **example code**. It publishes schemas, front-ends, and
back-end JSON APIs that demonstrate one uniform design across hundreds of
clinical and administrative forms. It is not a hosted service, it holds no
patient data, and nothing in it is deployed by this project on anyone's behalf
(see [`AI_STATEMENT.md`](AI_STATEMENT.md) §9 for the data posture, which is
structural and checkable).

That shapes what a vulnerability *is* here. The realistic harm is downstream: a
weakness copied out of this repository into something a person actually deploys.
So the bar for a report is not "can you exploit formexamples.com" — it is "would
a competent adopter, following this repository's own instructions, end up
vulnerable".

## Scope

**In scope**

- An injection, authentication, authorization, or data-exposure flaw in a form's
  `back-end-with-loco/` crate.
- A cross-site scripting, cross-site request forgery, or injection flaw in a
  form's `front-end-with-html/` or `front-end-with-svelte/`.
- A SQL migration that grants more than it should, or an OpenAPI or FHIR
  representation that discloses a field the schema marks private.
- A `bin/` tool that executes untrusted input, or writes outside its intended
  paths.
- A supply-chain problem: a dependency advisory `cargo deny` should have caught
  and did not, or a vendored snapshot that does not match its pinned upstream
  commit.
- A CI workflow weakness: a privileged trigger, a script injection, or a token
  scope wider than the job needs.

**Out of scope**

- **The development defaults, which are development defaults on purpose.** Each
  Loco crate ships a `config/development.yaml` with a scaffolded JWT secret, a
  trust-auth local database, seed fixtures, and permissive local settings.
  These are committed so a reader can run the thing in one command. They are
  not a vulnerability in this repository; deploying them unchanged is a
  vulnerability in *your* deployment, and [`INSTALL.md`](INSTALL.md) says so.
- **Clinical correctness.** A wrong threshold or a mis-implemented score is a
  serious defect and this project wants the report — but it is a defect, filed
  as an issue, not a security report.
- Anything about `formexamples.com` beyond the static content this repository
  builds: it is GitHub Pages serving a static site, with no back end and no
  accounts.
- Findings that require an attacker who already has commit access, or physical
  access to the developer's machine.

## Publishing and Trusted Publishing

This repository does not publish a package today — no crate to crates.io, no
module to npm, no image to a container registry
([`INSTALL.md`](INSTALL.md), [`MAINTAINERS.md`](MAINTAINERS.md)) — so there is
no long-lived publishing token sitting in repository secrets to leak.

That is a statement about this repository specifically, not a stance against
ever publishing one anywhere. As a general supply-chain policy, this project
intends to adopt [Trusted Publishing](https://crates.io/docs/trusted-publishing)
— OIDC-based, short-lived credentials scoped to a single CI run, issued at
publish time, rather than a static API token stored indefinitely in repository
secrets — for any future package this project or a future one publishes from
CI, once it is production-ready across the code forges actually in use here
(GitHub, Codeberg, GitLab) and whichever registry a publish would target.
Recorded as policy in [`spec/trusted-publishing/`](spec/trusted-publishing/).

## Supported versions

| Version | Supported |
| --- | --- |
| `main`, current HEAD | yes |
| any older commit or tag | no |

There is one supported version and it is the tip of `main`. The project has a
single maintainer ([`MAINTAINERS.md`](MAINTAINERS.md) is blunt about what that
means), so there is no backport lane and no long-term-support branch. Fixes land
on `main`; adopters who pin should rebase.

## Reporting a vulnerability

**Do not open a public issue for a suspected vulnerability.**

Report privately to **<joel@joelparkerhenderson.com>**, with:

- what you found, and where — file path and line, or the form slug and stack;
- how to reproduce it, ideally as a failing command or a minimal case;
- what an attacker gets from it;
- whether you have published anything about it, or intend to, and when.

Encrypted mail is welcome if you prefer it; say so in a first message and a key
will be exchanged.

### What you can expect

| Stage | Commitment |
| --- | --- |
| Acknowledgement of your report | within 7 days |
| An assessment: accepted, out of scope, or needs more information | within 14 days |
| A fix on `main`, for an accepted report | as fast as a one-person project can, with the target and the reason stated in the reply |

These are the commitments of a single unpaid maintainer, and they are set at
values that can actually be met rather than at values that look impressive.

**If you get no acknowledgement within 7 days, escalate publicly.** Open an
issue, or publish. That is explicitly permitted by this policy, it is not a
violation of coordinated disclosure, and the fallback exists so that a silent
maintainer cannot become an indefinite embargo.

### Coordinated disclosure

The preference is: report privately, agree a date, publish together. Ninety days
is the default ceiling, and shorter is fine when the fix is quick or the issue
is being exploited. This project will not ask you to delay beyond a date you have
agreed to, and will not use a fix as leverage to extend one.

### Credit

Reporters are credited by name and link in the fix's commit and in
[`CHANGELOG.md`](CHANGELOG.md), unless you ask not to be. There is no bug
bounty; there is no money in this project to pay one, and saying so up front is
fairer than letting you find out after the work.

## If you are deploying any of this

The honest checklist, because a security policy that omits it is decorative:

- Replace every value in `config/development.yaml` and
  `config/production.yaml` — the JWT secret above all — and load secrets from
  the environment, never from a committed file.
- Put the JSON API behind your own authentication and authorization. The
  scaffolded crates demonstrate the data shape and the routes; they are not an
  access-control design.
- Terminate TLS in front of it, and set your own CORS policy.
- Re-run the supply-chain gate (`cargo deny --all-features check`) on your fork,
  on your schedule. This repository's dependency pins are current as of its last
  commit and no later.
- Treat the seed fixtures and personas as what they are: synthetic sample data
  to be deleted, not a starting dataset.
