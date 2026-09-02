# AI Statement

Version 1.2.1, status is active.

Canonical location is `AI_STATEMENT.md` at the repository root.

Reviewed at least at every major release.

**Abstract.** This document discloses how artificial-intelligence tools are used
to develop this repository. It states what the tools do and do not touch, who is
accountable, which controls bound the work and how each is enforced, the
licensing and data posture, the rules for contributors, the uses that are
prohibited, and the limitations that survive all of it. It is a self-declaration
by the maintainer, written for evaluators and regulated adopters performing
supplier due diligence, and it changes in the same pull request that changes the
practice it describes.

The key words **shall**, **should**, and **may** are used as ISO/IEC Directives
Part 2 defines them: requirement, recommendation, permission.

## 1. Scope

This document covers the use of AI tools in developing everything in this
repository: the form specifications, the SQL schemas, the generated
representations, the two front-end stacks, the Rust back-end crates, the `bin/`
toolchain, the documentation, and this statement.

It does not cover an AI system in the product, because there is none. No form in
this repository calls a model at runtime. Every scoring engine is deterministic
arithmetic over the answers a person entered, and the same input always produces
the same score, grade, and flags. AI is used to *build* the software, in the
same sense that autocomplete, linters, and compilers are used to build it.

## 2. Which frameworks apply here, and which do not

- **The EU AI Act imposes no obligation on this project.** The Act binds
  providers and deployers of AI systems (Articles 2 and 3(1)); this repository
  is not one. Article 50's marking duties bind the AI tool's provider, not the
  tool's user, and the European Commission's Article 50 FAQ places source code
  outside the content-marking obligation. This document is voluntary.
- **Medical-device regulation does not classify this repository as a device.**
  Under MDCG 2019-11 Rev. 1, software that stores, transfers, and retrieves
  records without acting on them for an individual patient's benefit is not
  qualified as a medical device. What ships here is a set of worked *examples*:
  schemas, front-ends, and APIs demonstrating one uniform design across many
  clinical domains. A downstream integrator who deploys any of it with a medical
  purpose, for real patients, becomes the provider of whatever they build; that
  classification is theirs to make, and this document exists partly so they can
  answer their own supplier questions.
- **ISO/IEC 42001 and the NIST AI RMF are used as vocabulary, not claimed as
  conformity.** No certification is claimed, no audit has occurred, and the
  words "certified", "audited", and "validated" appear in this document only
  inside this sentence, to say they do not apply.

## 3. Terms

This document uses the W3C AI Content Disclosure vocabulary:

- **none** — entirely human-authored.
- **ai-assisted** — human-authored; AI edited, refined, or filled in
  boilerplate.
- **ai-generated** — AI-generated with human prompting and human review.
- **autonomous** — AI-generated without meaningful human oversight.
- **agentic tool** — a tool that plans and executes multi-step work under a
  human's direction, as opposed to inline completion.

## 4. Accountability

[`MAINTAINERS.md`](MAINTAINERS.md) lists the accountable maintainer for every
change in this repository, whatever tool produced the bytes.

## 5. Where AI is used, and at what level

The tooling is agentic AI coding assistance (currently Claude Code, by
Anthropic), operated in sessions the maintainer directs, reviews, and merges.
The repository is instrumented for it: [`AGENTS.md`](AGENTS.md), the per-stack
docs under [`AGENTS/`](AGENTS), and a per-form `AGENTS.md` state the conventions
a session must follow, and the gates in §7 decide whether it did.

Levels below use the §3 vocabulary, per development activity. Deliberately, no
percentage appears anywhere in this document: no defensible method exists for
measuring one.

| Activity | Level | Notes |
| --- | --- | --- |
| Form specifications and clinical reference docs | ai-assisted | sourced from published instruments and public forms; the maintainer decides what a form covers |
| SQL schemas and generated representations | ai-generated | authored in directed sessions; the generators are deterministic and their output is gate-checked |
| Scoring engines | ai-generated | held to the published instrument they implement; cross-checked between the plain-JS and TypeScript implementations |
| Front-end and back-end code | ai-generated | written in directed sessions; reviewed and merged by the maintainer |
| `bin/` toolchain and its drift detectors | ai-generated | each tool carries a `--check` mode that CI runs against committed output |
| Tests, personas, and example fixtures | ai-generated | held to the same authority as the code they test: expectations cite the form's spec |
| Documentation and this statement | ai-generated | held to the repository's own prose rules, including [Oxford spelling](spec/oxford-spelling/oxford-spelling.md) |
| Which forms exist, and what a form means clinically | none | decided by the maintainer and recorded in the form's `spec/index.md` |
| Release decisions and contribution verdicts | none | the maintainer's, and no tool's |
| Publishing a crate to crates.io (`cargo publish`) | autonomous | standing exception, maintainer-granted 2026-09-02: Claude Code judges for itself which crates are ready, removes `publish = false` where it judges a crate should be publishable, and runs `cargo publish`, without asking per crate or per publish — see [`GOVERNANCE.md`](GOVERNANCE.md) §"Publishing crates". No other release mechanic moves with it |

## 6. Human oversight

The maintainer directs the work, reviews it, and merges it. **No AI tool merges
anything**, and no automation has write access to the default branch.

One bounded, explicit exception exists, granted 2026-09-02 and recorded in
[`GOVERNANCE.md`](GOVERNANCE.md) §"Publishing crates": Claude Code may decide
for itself which fleet crates are ready to publish, remove their
`publish = false`, and run `cargo publish`, without asking per crate or per
publish. It is scoped narrowly to publishing — not a merge, a GitHub release,
a version tag, or anything else this section or §11 covers — and it is
recorded here rather than left inside a tool session precisely because §13's
rule applies to changes in practice as much as to changes in code: a standing
grant of autonomous authority is exactly the kind of fact this statement
exists to keep truthful.

Where the tools run sessions, decisions with consequences — what a specification
silence means, which convention a fleet-wide rollout adopts, what ships — are
recorded in the specs (`spec.md`, `spec/`, `forms/<slug>/spec/index.md`) and in
each form's `plan.md` and `tasks.md`. A decision that exists only inside a tool
session is not a decision this project made.

## 7. Quality controls

The controls below are the reason a reader does not have to take §5 on faith.
They are committed scripts; they run in CI on every push
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)); and they fail the
build rather than warn.

- **Specification authority.** The specs are in the repository and are the only
  conformance oracle. `sql/` is the source of truth for every data shape;
  everything derived from it is generated, never hand-edited.
- **Executed drift detection.** Every generator has a `--check` mode. CI
  regenerates each artefact and fails if the committed output differs. This is
  the control that catches a plausible-but-wrong edit regardless of who or what
  wrote it, because the only way to change a generated file is to change its
  generator or its source.
- **Structure and schema gates.** `bin/test` validates every form's layout;
  `bin/test-sql-apply` applies every form's migrations in order to a fresh
  Postgres; `bin/test-examples-conformance` checks each fixture against the
  schema it claims to match.
- **Contract gates.** The Lily HTML and Svelte class contracts, the ES-modules
  contract, the Loco queue/observability conventions, and the
  migration-vs-`sql/` defaults and nullability detectors each have a `--check`
  gate.
- **External validators.** Generated FHIR R5 resources and Bundles are validated
  by the official HL7 validator; XML against its DTDs; Protocol Buffers by
  `protoc`; OpenAPI 3.1 by a spec validator.
- **Static and supply-chain gates.** `clippy`, `cargo deny` policy (advisories,
  licences, bans, sources) per crate, and `svelte-check` per front-end.
- **Accessibility.** A nightly Playwright smoke plus axe-core sweep over the
  form front-ends.

The full list, and what each gate proves, is in
[`docs/verification.md`](docs/verification.md) and the Verify section of
[`CONTRIBUTING.md`](CONTRIBUTING.md).

## 8. Licensing and provenance of AI output

The project is licensed; see [`LICENSE.md`](LICENSE.md). The position taken here
follows the Apache Software Foundation's and LLVM's published reasoning: an AI
tool's output does not launder anyone's copyright, the full provenance of
generated text is generally not knowable, and prompting alone is not treated as
authorship.

In practice: contributions of substantially copied third-party material are
refused however they were produced; generated code is held to the same
originality expectations as human code, under the same review; and if
identifiable third-party material is found in the tree, it is removed or
licensed properly, exactly as it would be for a human-introduced copy. The tools
are used under terms that do not restrict the output's use in licensed software.

Two provenance notes specific to this repository. **Clinical instruments** —
scores, scales, and grading rules — are the work of their publishers; this
repository implements them and cites them in each form's `doc/`, and any
instrument with its own licence terms remains subject to them, whoever
implemented the arithmetic. **Vendored third-party code** — the Lily Design
System snapshots under `forms/lily-spec/` and `forms/lily-svelte-spec/`, pinned
by upstream commit in `forms/lily-version.md` and
`forms/lily-svelte-version.md` — is upstream's work under upstream's licence,
re-synced by tool and never hand-edited.

## 9. Data

**No patient data, no personally identifiable health information, and no
customer data exists anywhere in this project** — not in the repository, not in
test fixtures, not in personas, not in telemetry, and therefore not in any
prompt. Every example, persona, and fixture is synthetic and was authored for
this repository. The form designs derive from published public instruments and
public forms (NHS, WHO, DVLA, HSE, and equivalent), which are documents, not
records about people.

This is a structural property a reader can check against the tree, not a promise
about tool behaviour: the fixtures are committed, and
`bin/test-examples-conformance` enumerates them.

Vendor-side data handling is governed by the tool vendor's terms; this document
deliberately makes no claim on the vendor's behalf, because such claims go stale
silently.

## 10. Rules for contributors

Contributors **may** use AI tools. A contribution with **ai-generated** content
per §3 **shall** say so in the pull-request description — which tool, and what
it did.

Disclosure belongs in the PR description — which tool, and what it did — and,
as of 2026-09-02, a commit it touched also carries two trailers naming it:
`Co-Authored-By:`, the standard git/GitHub attribution trailer (GitHub
renders it as a co-author on the commit), and `Claude-Session:`, a link to
the session transcript — not a standard git trailer, specific to this tool,
and doing a different job: provenance a reader can follow, not attribution.
See `CONTRIBUTING.md`'s Commit conventions for the exact form. Git's
`Author:`/`Committer:` fields stay the human's either way; neither trailer
touches them — each is a second, additional line on the commit, not a claim
about who ran `git commit`. This supersedes this
document's earlier "never in commit trailers" position (see Annex A): the
per-commit trailer and the PR-description narrative now do different jobs —
one is a durable, per-commit record even a squash-merge or a PR-description
edit cannot lose; the other is where the fuller "what it did" explanation
lives, which no trailer format can carry.

The contributor remains responsible for their submission in full, under the same
[`CONTRIBUTING.md`](CONTRIBUTING.md) bar as any other work: understood,
explained on request, tested, and honest.

## 11. Prohibited uses

In this project, AI **shall not**: merge anything; adjudicate, score, or decide
reviews of contributions (a tool's review is advisory input to the maintainer,
never a verdict); sign anything; decide a specification-facing question
(silences are adjudicated by the maintainer and recorded in the spec, per
[`GOVERNANCE.md`](GOVERNANCE.md)); invent
clinical content — a threshold, a scoring rule, or a grading band that no cited
instrument supports; or weaken a test, an expectation, or a gate to make
something pass. The last is a standing hard rule, for humans and tools alike.

## 12. Limitations and residual risks

This section exists because a disclosure without one is marketing.

- **The gates prove what they test, not correctness.** The drift detectors prove
  that generated artefacts match their sources, and the schema gates prove the
  schemas apply. Neither proves that a scoring engine matches the clinical
  instrument it names. That is reviewed by a human against the cited source, and
  human review is the weaker control of the two.
- **Clinical validity is not claimed.** These are examples. No form here has
  been clinically validated, trialled, or approved for care, and nothing in this
  repository should be used to make a decision about a real person without the
  adopter doing that work themselves.
- **Review depth is one person's.** The project has a single maintainer;
  machine gates stand in for the review capacity a larger team would have
  ([`MAINTAINERS.md`](MAINTAINERS.md) says this plainly, and
  [`GOVERNANCE.md`](GOVERNANCE.md) states the route to a second one). "The
  maintainer understands and can explain every merged change" is the honest
  claim; "every line was independently re-derived" would not be.
- **Scale outruns per-line reading.** This repository holds hundreds of forms
  built by mechanical rollout across all of them at once. The gates are what
  make that safe; where a gate does not cover a rollout, the risk is real, and
  the mitigation is that a rollout must ship with the detector that guards it.
- **Retroactivity.** Commits predating this statement carry no disclosure
  markers; this document describes the practice, not a per-commit audit trail,
  and no such trail is claimed.
- **Provenance uncertainty survives.** Whether any generated fragment echoes
  unlicensed training material is not fully knowable with current tools; §8
  states the handling, not a guarantee.
- **The legal ground is unsettled.** Copyright in AI output is an open question
  in most jurisdictions; this document records positions, and positions may have
  to change. §13 names the triggers.
- **This is a self-declaration.** No third party has audited it. The checkable
  artefacts in §7 are the counterweight: they can disagree with this document,
  and if they do, the document is wrong.

## 13. Review and change

This statement is reviewed at every major or minor release, and revised
off-cycle when any of these fires: the tooling changes materially; a tool
vendor's terms change in a way §8 or §9 relies on; a binding rule emerges (EU AI
Act guidance touching this use, a foundation policy this project follows, a
court decision on AI output and copyright); or a claim in this document stops
being true.

The maintainer owns the review; the change lands as a pull request like
everything else, and the version and the change log in Annex A update in the
same pull request.

## 14. Reporting

A suspected provenance, licensing, or quality problem in this repository —
including a claim in this document that does not survive checking — is a report
this project wants. Open an issue and cite this file. For anything
security-sensitive, follow [`SECURITY.md`](SECURITY.md) instead: report
privately to <joel@joelparkerhenderson.com>, and do not open a public issue.

The handling commitment is the same as for any defect: attributed, answered on
the tracker, and never silently absorbed.

## 15. References

**Normative for this project** — the documents that bind the practice described
here: [`LICENSE.md`](LICENSE.md); [`spec.md`](spec.md) and the per-form
`forms/<slug>/spec/index.md`; the repository's rule set
([`AGENTS.md`](AGENTS.md), [`AGENTS/`](AGENTS),
[`spec/`](spec), in particular
[`spec/oxford-spelling/oxford-spelling.md`](spec/oxford-spelling/oxford-spelling.md)
and [`spec/es-modules.md`](spec/es-modules.md));
[`GOVERNANCE.md`](GOVERNANCE.md); [`MAINTAINERS.md`](MAINTAINERS.md);
[`CONTRIBUTING.md`](CONTRIBUTING.md); [`SECURITY.md`](SECURITY.md);
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

**Informative** — the sources this document's structure and positions draw on:
the W3C AI Content Disclosure vocabulary; the ISO/IEC Directives Part 2 document
conventions and verbal forms; ICMJE's AI-authorship position; the Apache
Software Foundation's generative-tooling guidance; the Linux Foundation's
generative-AI policy; the Fedora Council's AI-assisted-contributions policy; the
Linux kernel, LLVM, Kubernetes, NumPy, Mozilla, QEMU, curl, and Gentoo
positions; the OpenSSF security guidance for AI code assistants; NIST AI RMF and
ISO/IEC 42001 as vocabulary; EU AI Act Articles 2, 3, and 50 with the European
Commission's Article 50 FAQ; MDCG 2019-11 Rev. 1.

## Annex A. Change log

| Version | Date | Change |
| --- | --- | --- |
| 1.2.1 | 2026-09-02 | §10 clarified: the `Claude-Session:` trailer (a session-transcript link — provenance, not attribution) was already actual practice alongside `Co-Authored-By:` but had never been documented; named it and distinguished its purpose from `Co-Authored-By:`'s. `CONTRIBUTING.md`'s Commit conventions updated to match. |
| 1.2.0 | 2026-09-02 | §10 reversed: a commit a tool touched now carries a `Co-Authored-By:` trailer naming it, alongside (not instead of) the PR-description disclosure; corrected the same day the 1.1.0 change below was made. `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md` updated to match. |
| 1.1.0 | 2026-09-02 | Maintainer granted Claude Code standing, autonomous authority to decide which fleet crates are publishable, remove their `publish = false`, and run `cargo publish` (§5 table, §6, Annex B); scoped narrowly to publishing — no other release mechanic — recorded in [`GOVERNANCE.md`](GOVERNANCE.md) §"Publishing crates". |
| 1.0.0 | 2026-08-26 | First issue. |

## Annex B. Machine-readable summary

Levels per the W3C AI Content Disclosure vocabulary (§3); the prose above is
authoritative where the two could ever disagree.

```yaml
ai-statement:
  version: 1.2.1
  last-updated: 2026-09-02
  vocabulary: w3c-ai-content-disclosure
  disclosure-default: ai-generated
  disclosure-channels:
    - pull-request-description
    - commit-co-authored-by-trailer
    - commit-claude-session-trailer
  tools:
    - name: Claude Code
      provider: Anthropic
  processes:
    specification: ai-assisted
    implementation: ai-generated
    testing: ai-generated
    documentation: ai-generated
    review: none
    adjudication: none
    release-decisions: none
    cargo-publish: autonomous
  ships-ai-system: false
  runtime-model-calls: false
  autonomous-use:
    - scope: cargo-publish
      granted: 2026-09-02
      grantor: maintainer
      note: >-
        Claude Code judges for itself which fleet crates are publishable,
        removes their `publish = false`, and runs `cargo publish`, without
        asking per crate or per publish. No other release mechanic (merge,
        GitHub release, version tag) is included.
```
