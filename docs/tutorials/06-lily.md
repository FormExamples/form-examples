# Tutorial 6 — Customize Lily

Every form's UI is built to the **Lily Design System** — a *headless* component
contract shared by the HTML and Svelte front-ends. "Headless" means Lily fixes
the class vocabulary, prop signatures, and accessibility behaviour, but leaves
the actual styling (theme tokens) to each app. This tutorial shows how to check
a form's conformance, refactor it onto the contract, keep the pinned upstream
snapshot honest, and roll a class change across the corpus.

The tooling comes in two families — HTML and Svelte — with matching verbs.

| Purpose | HTML | Svelte |
| --- | --- | --- |
| Refactor a form onto the contract | `bin/lily-html-refactor` | `bin/lily-svelte-refactor` |
| Snapshot / drift-check the pinned upstream | `bin/lily-sync` | `bin/lily-svelte-sync` |
| Per-form conformance report | *(via `bin/test`)* | `bin/lily-svelte-status` |

Run from the repository root.

## 1. Check a form's conformance

`bin/lily-svelte-status` classifies every Svelte front-end as **PASS** (canonical
Lily UI), **PARTIAL** (Lily classes but legacy component names), **TODO** (no
Lily yet), or **EMPTY** (no implementation):

```sh
bin/lily-svelte-status --help
bin/lily-svelte-status --counts
bin/lily-svelte-status --status=PASS --slugs-only
```

The Svelte reference form `cardiology-request` is a PASS — use it as the target
shape when converting a form:

```sh
bin/lily-svelte-status --slugs-only | grep cardiology-request
ls forms/cardiology-request/front-end-with-svelte/src/lib/components/ui
```

## 2. What the contract is

The component vocabulary — the classes each `src/lib/components/ui/` component
must emit (`text-input`, `radio-group`, `button`, …) and the prop signatures it
must accept — is defined in the front-end agent docs and captured as source
snapshots:

```sh
ls forms/lily-spec
ls forms/lily-svelte-spec
```

The exact upstream commit those snapshots came from is pinned in:

```sh
cat forms/lily-version.md
cat forms/lily-svelte-version.md
```

## 3. Theming

Lily is headless, so a theme is just the set of design tokens the app resolves
the Lily classes to. In the Svelte apps the theme lives with the component set
and the `ThemePicker` control:

```sh
ls forms/cardiology-request/front-end-with-svelte/src/lib/config/themes.ts
ls forms/cardiology-request/front-end-with-svelte/src/lib/components/ui/ThemePicker.svelte
```

To re-theme, you change the token values — never the Lily class names, because
the class names are the contract every tool checks.

## 4. Refactor a form onto the contract

The refactor tools do the mechanical class swaps for you. Always dry-run first,
then apply, then re-check. For the HTML front-ends:

```sh
bin/lily-html-refactor --help
bin/lily-html-refactor --dry-run apgar-score
bin/lily-html-refactor apgar-score
bin/lily-html-refactor --check --all
```

For the Svelte front-ends the verbs mirror exactly:

```sh
bin/lily-svelte-refactor --dry-run apgar-score
bin/lily-svelte-refactor apgar-score
bin/lily-svelte-refactor --check --all
```

`--check` is the CI drift detector: it fails if any form drifts from the class
contract. The refactor tools handle mechanical swaps only; they *report* the
semantic restructures (sectionCard → fieldset, radio-group rewiring) that need a
hand pass.

## 5. Roll out a class change

The corpus-wide pattern (from `CONTRIBUTING.md`, "Batching and mechanical
rollouts"): design the change once on a **reference form**
(`pre-operative-assessment-by-clinician` for HTML, `cardiology-request` for
Svelte), review it, then roll it out mechanically and re-verify with the
relevant `--check` gate:

```sh
# 1. Prove the reference form still conforms after your change:
ls forms/pre-operative-assessment-by-clinician/front-end-with-html
bin/lily-html-refactor --check pre-operative-assessment-by-clinician

# 2. Apply across every form:
bin/lily-html-refactor --all

# 3. Re-verify the whole corpus:
bin/lily-html-refactor --check --all
bin/lily-svelte-refactor --check --all
```

## 6. Keep the upstream snapshot honest

When Lily itself changes upstream, re-snapshot and re-pin. The `--check` mode
detects when the committed snapshot has drifted from the pinned commit:

```sh
bin/lily-sync --check
bin/lily-svelte-sync --check
```

A green run of both means the local `forms/lily-spec/` and
`forms/lily-svelte-spec/` match the commits recorded in `forms/lily-version.md`
and `forms/lily-svelte-version.md`.

## Verify you got here

```sh
# Every Lily tool this tutorial drives exists and is executable:
bin/lily-svelte-status --help
ls bin/lily-html-refactor bin/lily-svelte-refactor
ls bin/lily-sync bin/lily-svelte-sync
# The pinned-version files and snapshot dirs exist:
ls forms/lily-version.md forms/lily-svelte-version.md
ls forms/lily-spec forms/lily-svelte-spec
# The two reference forms exist:
ls forms/pre-operative-assessment-by-clinician/front-end-with-html
ls forms/cardiology-request/front-end-with-svelte
```
