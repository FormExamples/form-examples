#!/usr/bin/env python3
"""bin/generate-loco-deny-config.py — Write forms/<slug>/back-end-with-loco/deny.toml.

Every Loco crate shares the same `loco-rs` 0.16 dependency pin and
therefore (near enough) the same dependency graph, so one canonical
cargo-deny policy — advisories/licenses/bans/sources — applies to all of
them verbatim. This script writes that byte-identical policy into every
form's `back-end-with-loco/deny.toml`.

Generated artefact: do not hand-edit. Idempotent — re-running with no
upstream change is a no-op (same bytes). If a crate's dependency graph
ever needs a crate-specific exception, add it here with a per-crate
comment explaining why, rather than hand-editing the file in place (the
next `--check`-clean regeneration would silently drop it).

Usage:
  bin/generate-loco-deny-config.py            # generate for every form
  bin/generate-loco-deny-config.py <slug> ... # generate only the named forms
  bin/generate-loco-deny-config.py --check    # exit non-zero if any deny.toml would change
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"

LOCO_DIR_NAME = "back-end-with-loco"

DENY_TOML = """\
# cargo-deny policy for this Loco crate's dependency graph.
# Identical across every form's back-end-with-loco/ crate — do not hand-tune
# per crate; regenerate via bin/generate-loco-deny-config.py if the policy
# changes.
# Run: cargo deny --all-features check
# Reference: https://embarkstudios.github.io/cargo-deny/

[advisories]
ignore = [
    # rsa's Marvin-attack timing sidechannel (key recovery during RSA
    # decryption) has no fixed release yet -- rsa 0.9.x is the latest stable
    # line and the advisory stands against all of it. It arrives transitively
    # via loco-rs 1.1's jsonwebtoken, whose RSA (RS*/PS*) algorithms these
    # crates never select: every crate's auth config uses an HMAC (HS256)
    # shared-secret JWT, so no RSA decryption path is reachable. Revisit when
    # rsa publishes a fixed release and jsonwebtoken adopts it.
    { id = "RUSTSEC-2023-0071", reason = "no fixed rsa release exists; transitive via loco-rs 1.1's jsonwebtoken; unreachable here -- JWT auth is HMAC (HS256), no RSA algorithm is configured" },
]

[licenses]
# Every permissive license actually present across the corpus's dependency
# graph. Crates dual/triple-licensed under an SPDX OR expression (e.g.
# self_cell's "Apache-2.0 OR GPL-2.0-only", r-efi's "MIT OR Apache-2.0 OR
# LGPL-2.1-or-later") are satisfied via the permissive branch already listed
# here — no copyleft license needs to be (or is) allowed.
allow = [
    "0BSD",
    "Apache-2.0",
    "Apache-2.0 WITH LLVM-exception",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "BSL-1.0",
    "CC0-1.0",
    "CDLA-Permissive-2.0",
    "ISC",
    "MIT",
    "MPL-2.0",
    "Unicode-3.0",
    "Unlicense",
    "Zlib",
]
confidence-threshold = 0.8

[licenses.private]
# This crate and its migration/ sub-crate are `publish = false`; skip
# license checking on unpublished workspace members.
ignore = true

[bans]
multiple-versions = "warn"
wildcards = "allow"

[sources]
unknown-registry = "warn"
unknown-git = "warn"
allow-registry = ["https://github.com/rust-lang/crates.io-index"]
"""


def target_forms(slugs: list[str]) -> list[str]:
    if slugs:
        return slugs
    return sorted(
        p.parent.parent.name
        for p in FORMS_DIR.glob(f"*/{LOCO_DIR_NAME}/Cargo.toml")
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    slugs = target_forms(args.slugs)
    present = 0
    missing = 0
    drift = 0
    for slug in slugs:
        loco_dir = FORMS_DIR / slug / LOCO_DIR_NAME
        if not (loco_dir / "Cargo.toml").is_file():
            continue
        deny_path = loco_dir / "deny.toml"
        if args.check:
            if not deny_path.is_file():
                print(f"missing: {deny_path}")
                missing += 1
            elif deny_path.read_text() != DENY_TOML:
                print(f"drift: {deny_path}")
                drift += 1
            else:
                present += 1
        else:
            deny_path.write_text(DENY_TOML)

    if args.check:
        total = present + missing + drift
        print(
            f"loco deny.toml [CHECK]: {total} target(s), "
            f"present={present}, missing={missing}, drift={drift}"
        )
        return 1 if (missing or drift) else 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
