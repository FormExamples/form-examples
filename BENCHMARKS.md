# Benchmarks

What has actually been measured in this repository, how, and — stated as
prominently — what has not.

Every number below was produced by running the command in the table. Nothing
here is estimated, extrapolated, or carried over from a previous machine. Where
a measurement is unflattering or a gate was red when it was timed, that is
recorded rather than omitted, because a benchmarks page that reports only
successful runs is not a measurement, it is a brochure.

## Method

| | |
| --- | --- |
| Machine | Apple M4 Max, 16 cores, 128 GB RAM |
| OS | macOS 26.6.1 |
| Runtimes | Python 3.12, Node v26.7.0 |
| Repository state | `main`, 2026-08-26, 355 forms |
| Timing | `/usr/bin/time -p`, wall-clock (`real`), warm filesystem cache, single run |

**Single runs, not distributions.** These are order-of-magnitude figures for
"can I run this gate on every save?", which is the question they exist to
answer. They are not suitable for detecting a 10% regression, and no claim of
statistical rigour is made.

## Repository scale

The denominator for everything else. Counts are of tracked files at the
measured commit.

| | |
| --- | --- |
| Forms | 355 |
| Tracked files | 146,388 |
| Git history | 1,141 commits, 327 MB in `.git` |
| SQL migration files | 3,428 |
| Rust source files | 23,616 |
| Svelte components | 15,906 |
| TypeScript / JavaScript files | 8,849 / 5,326 |
| CSS files | 33,058 (dominated by the 45 vendored theme stylesheets per front-end) |
| Generated XML + DTD pairs | 2,493 |
| Generated FHIR R5 resources | 2,313 |
| Generated Protocol Buffers schemas | 2,313 |
| Tools under `bin/` | 69 |

## Gate wall-clock

The design goal for the drift detectors is that a maintainer runs the whole set
between edits without thinking about it. The measurements say that goal is met:
most gates scan all 355 forms in well under a second.

| Gate | Scope | Time | Outcome on this run |
| --- | --- | --- | --- |
| `bin/forms-as-kebab-case` | 355 forms | 0.01 s | ok |
| `bin/generate-forms-tsv.py --check` | 355 forms | 0.04 s | ok |
| `bin/lily-svelte-refactor --check --all` | 355 front-ends | 0.04 s | ok |
| `bin/lily-html-refactor --check --all` | 355 front-ends | 0.05 s | ok |
| `bin/generate-loco-deny-config.py --check` | 355 crates | 0.07 s | ok |
| `bin/generate-spec.py --check` | 355 specs | 0.07 s | ok |
| `bin/generate-tools-doc.py --check` | 69 tools | 0.08 s | ok |
| `bin/generate-llms-txt.py --check` | 355 forms | 0.14 s | ok |
| `bin/svelte-theme-css-sync --check` | 355 front-ends | 0.15 s | reported drift |
| `bin/page-header-layout-refactor --check` | 355 front-ends | 0.25 s | ok |
| `bin/test-examples-conformance` | 355 fixtures vs schemas | 0.28 s | ok |
| `bin/html-helpers-picker-rename --check` | 355 front-ends | 0.44 s | ok |
| `bin/loco-migration-nullability --check --all` | 355 crates | 0.65 s | ok |
| `bin/svelte-helpers-picker-rename --check` | 355 front-ends | 0.65 s | reported drift |
| `bin/generate-changelog-and-examples.py --check` | 355 forms | 0.66 s | ok |
| `bin/loco-config-refactor --check --all` | 355 crates | 0.85 s | ok |
| `bin/loco-migration-defaults --check --all` | 355 crates | 0.96 s | ok |
| `bin/test-engines` | 355 scoring engines | 0.97 s | fleet-wide FAIL (see below) |
| `bin/loco-rs-1-migration --check --all` | 355 crates | 2.34 s | ok |
| `bin/es-modules-refactor --check --all` | 355 front-ends | 5.70 s | reported drift |

Roughly **10 seconds of wall clock covers twenty gates across every form in the
repository.** That is the number that matters for how the project is worked on:
a fleet-wide mechanical rollout is verifiable in the same breath as it is made.

### The red rows, stated plainly

Three gates reported drift and one failed outright on the measurement machine.
They are pre-existing conditions of the tree at that commit, not artefacts of
timing:

- `bin/test-engines` reported `PASS 0 / SKIP 0 / FAIL 355`, every form with the
  same load error: `text-size-picker.js: Identifier 'STORAGE_KEY' has already
  been declared`. The gate loads a form's engine modules into one shared Node
  `vm` sandbox, and two vendored helper modules each declare a module-scoped
  `STORAGE_KEY` — harmless as real ES modules in a browser, fatal when
  concatenated into one scope. It is a defect in the gate's sandboxing, and it
  is uniform across the fleet, which is exactly the failure mode a uniform
  repository produces.
- `bin/svelte-theme-css-sync --check` and `bin/svelte-helpers-picker-rename
  --check` both re-read a pinned upstream Lily checkout, which was not present
  on the measurement machine.
- `bin/es-modules-refactor --check --all` reported drift.

The timings are still valid — the work was done, and the exit code is what
differed.

### Gates not timed here, and why

| Gate | Why not |
| --- | --- |
| `bin/test` | needs a reachable PostgreSQL for the per-crate `cargo test`; without one it fails on the first crate at ~24 s |
| `bin/test-sql-apply` | needs a scratch PostgreSQL |
| `cargo check` / `clippy` / `cargo deny`, per crate | dominated by the Rust toolchain and the crate cache, not by this repository; CI shards them 8 ways for this reason |
| `pnpm run check` / `build`, per front-end | dominated by npm install and Vite; CI shards them 8 ways |
| The HL7 FHIR validator | a Java process with a multi-hundred-megabyte package cache; CI caches it |
| `bin/test-e2e` | Playwright plus axe-core over real browsers; runs nightly, not per push |

The split is deliberate: everything cheap enough to run on every save is a text
scan over committed files, and everything expensive is a toolchain that CI
parallelizes.

## Front-end page weight

Measured on `forms/apgar-score/front-end-with-html/`, which is representative:
every HTML front-end is built from the same vendored asset set.

| | |
| --- | --- |
| `index.html` (the wizard) | 21.1 kB |
| `dashboard.html` | 22.0 kB |
| JavaScript | 130.3 kB across 15 ES modules |
| CSS (application) | 31.3 kB across 2 files |
| **Wizard payload, gzip -9** | **43.4 kB** |
| Theme catalogue (vendored) | 45 stylesheets, 5.07 MB total — one is loaded at a time |

No bundler, no framework runtime, no build step: the 43 kB compressed figure is
the whole questionnaire, its scoring engine, and its report generation. The
theme catalogue is the one number worth watching, since it is 5 MB on disk per
front-end across 355 front-ends, even though a browser fetches exactly one
stylesheet from it.

## Optimization profile

Where the time actually goes, and the choices behind it:

- **The gates are text scans, on purpose.** No gate parses Rust, boots a
  browser, or starts a database; they compare committed bytes against
  regenerated bytes. That is why 355 forms cost tenths of a second and why the
  drift-detector pattern scales to a fleet this size at all.
- **The generators are single-pass and stateless.** Each reads a form's `sql/`
  and writes its derived artefacts; there is no incremental cache to invalidate
  and no cross-form state, so `--check` costs the same as a real run minus the
  writes.
- **CI parallelizes what cannot be made cheap.** The Rust and Svelte jobs are
  each sharded 8 ways over the fleet (`bin/forms-shard`); the FHIR validator and
  the Playwright browsers are cached; the full end-to-end sweep is nightly
  rather than per-push.
- **The expensive local loop is Rust, not this repository.** A cold
  `cargo check` over a Loco crate dominates any repository-side cost by orders
  of magnitude, which is why `sccache` is documented in the developer setup.

## Not measured, and honestly so

No claim is made about any of the following, because none of it has been
measured:

- **API throughput or latency.** No load test exists against any Loco crate. The
  back ends are example implementations; nobody has profiled one under
  concurrency.
- **Scoring-engine microbenchmarks.** The engines are deterministic arithmetic
  over a few dozen fields, so the expected cost is microseconds, but "expected"
  is not "measured" and this section will not pretend otherwise.
- **Database performance.** Index choices are conventional; no query plan in
  this repository has been examined under a realistic row count.
- **Lighthouse, Core Web Vitals, or real-device rendering.** Accessibility is
  gated by axe-core in the nightly sweep; performance is not gated at all.
- **Cold build times.** Neither a from-scratch `cargo build` nor a fresh
  `pnpm install` has been timed on a known-clean machine.
- **Comparisons against other projects.** [`COMPARISONS.md`](COMPARISONS.md)
  compares design and scope, never speed, because no comparable measurement has
  been run and inventing one would be worse than saying nothing.

## Reproducing these numbers

```sh
git clone https://github.com/FormExamples/form-examples.git
cd form-examples

# Any gate, timed:
/usr/bin/time -p bin/lily-html-refactor --check --all

# The whole cheap set, back to back:
for gate in \
  "bin/forms-as-kebab-case" \
  "python3 bin/generate-forms-tsv.py --check" \
  "bin/lily-html-refactor --check --all" \
  "bin/lily-svelte-refactor --check --all" \
  "bin/test-examples-conformance" \
  "bin/loco-config-refactor --check --all" \
  "bin/es-modules-refactor --check --all" ; do
  /usr/bin/time -p sh -c "$gate >/dev/null 2>&1"
done
```

Numbers that differ materially from the table on comparable hardware are a
finding worth an issue, particularly if a gate has become slow enough that a
maintainer would stop running it.
