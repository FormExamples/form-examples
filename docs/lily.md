# Lily Design System

Every front-end — HTML and Svelte — conforms to the **Lily Design System
headless** contract. "Headless" and "as a specification" are the key words: Lily
is consumed at _authoring time_ as a set of component class names and markup
shapes. There is **no runtime dependency, bundle, or vendored library** in the
forms. A form is Lily-conformant when its markup uses Lily's canonical class
names and structure.

Authoring rules live in [`forms/AGENTS-front-end-html.md`](../forms/AGENTS-front-end-html.md)
and [`forms/AGENTS-front-end-svelte.md`](../forms/AGENTS-front-end-svelte.md).

## The canonical UI component set

The wizard is built from a small, fixed vocabulary of components. In Svelte these
are files under `src/lib/components/ui/`; in HTML they are the equivalent class
names on semantic elements.

Core: **Form**, **Fieldset**, **Field**, **Button**, **ErrorSummary**, **Panel**,
**Progress**, plus a **StepList** / **StepListItem** for the wizard steps.
Inputs: **TextInput**, **NumberInput**, **DateInput**, **Select**,
**TextAreaInput**, **RadioGroup** / **RadioInput**, **CheckboxGroup** /
**CheckboxInput**, with **Hint** for help text. Feedback: **Alert**, **Badge**.
Theming: **ThemePicker**.

Because the form must be a single continuous wizard (root
[`AGENTS.md`](../AGENTS.md) "User interface"), these components render one
scrollable page with a Progress indicator, not multiple pages.

## The class contract

Lily uses **semantic class names with data-attribute variants**, not a `lily-`
prefix. The refactor tools encode the exact contract; representative swaps:

| Legacy                    | Lily                                    |
| ------------------------- | --------------------------------------- |
| `class="btn btn-primary"` | `class="button" data-variant="primary"` |
| `class="btn"`             | `class="button"`                        |
| `class="textarea"`        | `class="text-area-input"`               |
| `class="select-input"`    | `class="select"`                        |
| `class="form-actions"`    | `class="button-group"`                  |
| `class="report-region"`   | `class="panel"`                         |
| `class="status-banner"`   | `class="alert" data-type="warning"`     |

So a conformant HTML form uses classes like `form`, `fieldset`, `button`,
`button-group`, `panel`, `alert`, `error-summary`, `progress`, `text-area-input`,
and `select`. The canonical consolidated reference is `forms/cardiology-request`
for both stacks (see [`forms/AGENTS-front-end-html.md`](../forms/AGENTS-front-end-html.md)
§9 and [`forms/AGENTS-front-end-svelte.md`](../forms/AGENTS-front-end-svelte.md) §9).

## Tooling

### Mechanical refactor + drift check

- `bin/lily-html-refactor [--check] [--dry-run] [--scope=form|dashboard|both] [--all|<slug>]`
  — apply the HTML/JS class swaps. `--check` is the CI drift detector (non-zero on
  drift); `--dry-run` previews.
- `bin/lily-svelte-refactor [--check] [--dry-run] [--scope=…] [--show-risky] [--all|<slug>]`
  — the Svelte equivalent, plus a report of risky patterns that need a human.

Both only swap classes and mechanical markup; semantic and CSS work stays manual.

### Svelte conformance status

`bin/lily-svelte-status` classifies each form's Svelte front-end:

- **PASS** — canonical Lily UI components present (Form, Fieldset, Field, Button,
  ErrorSummary, Panel, Progress) and no legacy component filenames.
- **PARTIAL** — emits Lily classes but keeps legacy component filenames.
- **TODO** — has an implementation but no Lily conversion yet.
- **EMPTY** — no real implementation.

Use `--counts`, `--slugs-only`, and `--status=<value>` to filter. CI requires
**0 PARTIAL and 0 TODO** (see [Verification](verification.md)).

## The pinned-upstream snapshot model

The contract is pinned to a specific upstream Lily commit so it cannot drift
silently. Two snapshot mechanisms keep the vendored specs honest:

- `bin/lily-sync [--check] [--lily-dir PATH]` — snapshot the HTML component specs
  into [`forms/lily-spec/`](../forms/lily-spec/) and record the pinned commit in
  [`forms/lily-version.md`](../forms/lily-version.md).
- `bin/lily-svelte-sync [--check]` — the same for the Svelte component sources
  into `forms/lily-svelte-spec/` with `forms/lily-version.md`'s Svelte
  counterpart.

`lily-version.md` records the upstream repository, the pinned commit, and the
date. Newer Lily commits may rename classes; the workflow is to bump the pin only
after `bin/lily-html-refactor --check --all` and `bin/lily-svelte-refactor
--check --all` confirm the corpus still matches. The `--check` mode of each sync
tool is the drift detector that proves the vendored snapshot equals the pin.

See [Verification](verification.md) for how these gates run in CI and
[`spec.md`](../spec.md) §8 for the versioning-and-pin policy.
