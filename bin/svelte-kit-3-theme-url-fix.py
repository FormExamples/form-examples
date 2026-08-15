#!/usr/bin/env python3
"""bin/svelte-kit-3-theme-url-fix.py — one-shot fix for a bug the `sv migrate
sveltekit-3` codemod introduced fleet-wide in every `front-end-with-svelte`
root `+layout.svelte`.

Before the SvelteKit 3 migration (2026-08-15, "Update Svelte" commit), every
form's `+layout.svelte` built the Lily theme-catalogue URL by hand:

    import { base } from "$app/paths";
    ...
    themesUrl={`${base}/themes/`}

`sv migrate sveltekit-3` mechanically rewrote every occurrence to:

    import { resolve } from "$app/paths";
    ...
    themesUrl={resolve(`themes/`)}

which is wrong on two counts: (1) `resolve()` in SvelteKit 3 only accepts a
known route ID or pathname, not an arbitrary static-asset directory prefix,
and (2) even the asset-flavoured `asset()` function only accepts one of the
finite literal `static/themes/*.css` filenames it can see at build time, not
a directory prefix a component concatenates a runtime-selected theme slug
onto. Both fail `svelte-check` with a "not assignable" error on every single
form. `base`/`assets` are also no longer part of `$app/paths`'s public type
surface at the pinned `@sveltejs/kit: "next"` version, so reverting to the
pre-migration `${base}/themes/` form doesn't type-check either.

None of the 353 affected forms configures `kit.paths.base` (confirmed
fleet-wide before writing this tool), so `base` is always `''` and the
pre-migration expression always evaluated to the literal string
`/themes/` at runtime anyway. The fix hardcodes that literal, which
type-checks cleanly and is behaviourally identical to the pre-migration code:

    themesUrl="/themes/"

and drops the now-unused `import { resolve } from "$app/paths";` line (every
affected file uses `resolve(` exactly once, for this expression, confirmed
before writing this tool).

It also deletes each form's `front-end-with-svelte/MIGRATION_TASKS.md` —
the `sv migrate` codemod's own per-form task list — once confirmed resolved
(see the reference fix on `forms/blood-test-result/front-end-with-svelte`).

Usage:
  bin/svelte-kit-3-theme-url-fix.py --check          # CI drift detector
  bin/svelte-kit-3-theme-url-fix.py --apply          # rewrite in place
"""

import argparse
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

IMPORT_RE = re.compile(
    r"[ \t]*import \{ resolve \} from ['\"]\$app/paths['\"];[ \t]*\r?\n"
)
THEMES_URL_RE = re.compile(r"themesUrl=\{resolve\(`themes/`\)\}")
THEMES_URL_FIXED = 'themesUrl="/themes/"'


def find_layouts():
    return sorted(
        ROOT.glob("forms/*/front-end-with-svelte/src/routes/*/+layout.svelte")
    )


def plan(path: pathlib.Path):
    """Return (new_text, warning) — warning is None on a clean, safe fix."""
    text = path.read_text()
    if "themesUrl={resolve(`themes/`)}" not in text:
        return None, None
    resolve_uses = text.count("resolve(")
    if resolve_uses != 1:
        return None, f"{resolve_uses} uses of resolve( — needs manual review"
    new_text = THEMES_URL_RE.sub(THEMES_URL_FIXED, text)
    new_text, n = IMPORT_RE.subn("", new_text)
    if n != 1:
        return None, "themesUrl fixed but import line not found — needs manual review"
    return new_text, None


def main():
    ap = argparse.ArgumentParser()
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    layouts = find_layouts()
    drift = []
    warnings = []

    for path in layouts:
        new_text, warning = plan(path)
        if warning:
            warnings.append((path, warning))
            continue
        if new_text is None:
            continue
        drift.append(path)
        if args.apply:
            path.write_text(new_text)

    for path, warning in warnings:
        print(f"WARN {path.relative_to(ROOT)}: {warning}", file=sys.stderr)

    if args.apply:
        removed = 0
        for path in drift:
            migration_tasks = path.parents[3] / "MIGRATION_TASKS.md"
            if migration_tasks.exists():
                migration_tasks.unlink()
                removed += 1
        print(f"Fixed {len(drift)} +layout.svelte files, removed {removed} MIGRATION_TASKS.md")
        return 0

    # --check
    if drift or warnings:
        print(f"DRIFT: {len(drift)} +layout.svelte files need the themesUrl fix")
        for path in drift:
            print(f"  {path.relative_to(ROOT)}")
        return 1
    print("OK: no drift")
    return 0


if __name__ == "__main__":
    sys.exit(main())
