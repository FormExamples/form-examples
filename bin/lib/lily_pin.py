"""bin/lib/lily_pin.py — assert the local Lily checkout matches the recorded pin.

Several tools read component/theme source fresh from the local Lily checkout
(~/git/lilydesignsystem/lily-design-system/). When that checkout's HEAD moves
past the commit recorded in forms/lily-version.md, those tools' --check modes
would otherwise report fleet-wide "drift" that is really just an un-pinned
checkout. This helper turns that into a clear, actionable refusal instead.

Verification is best-effort by design: if the pin file is missing, the path is
not inside a git work tree, or git is unavailable, the caller proceeds (a
checkout exported without .git cannot be verified — refusing would make the
tools unusable there). Only a *contradiction* — a resolvable HEAD that does
not match the recorded pin — aborts.

Usage (from a bin/ tool):

    sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
    from lily_pin import assert_lily_pin
    assert_lily_pin(lily_dir, REPO_ROOT)
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

PIN_RE = re.compile(r"\|\s*Pinned commit\s*\|\s*`([0-9a-f]{7,40})`")


def _checkout_head(path: Path) -> str | None:
    """HEAD of the git work tree containing `path`, or None if unresolvable."""
    try:
        out = subprocess.run(
            ["git", "-C", str(path), "rev-parse", "HEAD"],
            capture_output=True, text=True, timeout=10,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    if out.returncode != 0:
        return None
    return out.stdout.strip()


def assert_lily_pin(
    lily_path: Path | str,
    repo_root: Path,
    pin_file: str = "forms/lily-version.md",
) -> None:
    """Exit with a clear message if the Lily checkout is not at the pin."""
    lily = Path(lily_path).expanduser()
    if not lily.exists():
        return  # the caller reports missing dirs itself
    pin_path = repo_root / pin_file
    try:
        match = PIN_RE.search(pin_path.read_text(encoding="utf-8"))
    except OSError:
        return
    if not match:
        return
    pin = match.group(1)
    head = _checkout_head(lily)
    if head is None:
        return  # exported checkout without .git — cannot verify
    if not head.startswith(pin):
        sys.exit(
            f"Lily checkout is at {head[:9]}, but {pin_file} pins `{pin}`.\n"
            f"This tool reads source fresh from the checkout, so running it now\n"
            f"would report fleet-wide drift that is really an un-pinned checkout.\n"
            f"Either check out the pin:\n"
            f"    git -C {lily} checkout {pin}\n"
            f"or deliberately re-pin to the checkout's HEAD first:\n"
            f"    bin/lily-sync && bin/lily-svelte-sync"
        )
