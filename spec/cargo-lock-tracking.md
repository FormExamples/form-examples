# Spec — Loco crates track Cargo.lock

Status: **accepted** (2026-07-27). Applies to every form's
`back-end-with-loco/` crate. This is a domain spec under the top-level
[`spec.md`](../spec.md) §6 (back-end contract); read it before changing a
Loco crate's `.gitignore`.

## 1. Decision

Every `back-end-with-loco/` crate's `Cargo.lock` is **tracked in git**, not
ignored. `.gitignore` carries `!Cargo.lock` (or omits any `Cargo.lock` rule
entirely), never a bare `Cargo.lock` ignore line.

## 2. Rationale

- Each `back-end-with-loco/` crate builds a **binary** (`cargo loco start`,
  the management CLI) — not a library published for downstream `cargo`
  consumers to resolve themselves. The standard Rust guidance to commit
  `Cargo.lock` for binaries (and only omit it for libraries) applies
  directly.
- Reproducible CI and reproducible `cargo deny check` results (see
  [`AGENTS/back-end-with-loco.md`](../AGENTS/back-end-with-loco.md)
  "Supply-chain policy") depend on every environment resolving the exact
  same dependency versions. An untracked lockfile lets CI silently resolve
  different transitive versions than a contributor's machine, which can
  make a security-advisory or license finding appear or disappear without
  any code change.
- This monorepo's per-crate `.gitignore` files were scaffolded across many
  sessions and drifted: 137 of 347 crates carried a bare `Cargo.lock` line
  (excluding it) while 210 already tracked it (`!Cargo.lock` or no rule at
  all). This spec makes the already-majority convention the uniform one.

## 3. What changes

- `.gitignore`: a bare `Cargo.lock` line becomes `!Cargo.lock` — everything
  else in the file (`target/`, `tmp`, …) is untouched.
- The `Cargo.lock` file itself, previously untracked in the 137 affected
  crates, is added to git as-is (whatever versions `cargo` had already
  resolved on disk).

## 4. Tooling and verification

- `bin/loco-config-refactor [--all|<slug>] [--check]` applies the fix
  mechanically (alongside its existing background-queue and observability
  conventions) and is idempotent — a crate whose `.gitignore` already
  tracks `Cargo.lock` is left untouched. `--check --all` is the CI drift
  detector.
- `git ls-files forms/*/back-end-with-loco/Cargo.lock | wc -l` should equal
  the count of `back-end-with-loco/Cargo.toml` files (one lockfile tracked
  per crate).

## 5. Out of scope

- `migration/` sub-crates share the parent crate's workspace lockfile;
  they have no `Cargo.lock` of their own to track.
- Front-end (`front-end-with-html/`, `front-end-with-svelte/`) lockfiles
  (`pnpm-lock.yaml`) are a separate, already-tracked convention; unchanged.
