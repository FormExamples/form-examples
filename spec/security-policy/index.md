# Security policy

Status: **in force** as of 2026-11-17.

The formal policy is [`SECURITY.md`](../../SECURITY.md). This spec records
what that policy must contain and how it is kept true, so it cannot quietly rot.

## Requirements

1. `SECURITY.md` has these sections: **Scope**, **Supported versions**,
   **Reporting a vulnerability**, **Severity and response targets**,
   **Coordinated disclosure**, **Safe harbor**, **Advisories and CVEs**,
   **Secure development**, **Credit**.
2. A machine-readable
   [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116) file is published at
   `/.well-known/security.txt`
   (`formexamples.github.io/static/.well-known/security.txt`), with `Contact`,
   `Expires`, `Policy` and `Canonical` fields.
3. `Expires` is in the future and no more than one year ahead (RFC 9116 §2.5.5
   recommends under a year). Renew it at least a month before it lapses.
4. The reporting address in `SECURITY.md` and in `security.txt` is the same.
5. Reports are private first; a silent maintainer can never become an
   indefinite embargo (the 7-day escalation rule stays).

## Verification

`bin/test-security-policy` checks all of the above. It also runs in CI, so an
expired `security.txt` fails the build rather than going unnoticed.
