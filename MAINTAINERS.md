# Maintainers and access continuity

This file is the roster, and the honest answer to the question a procurement
review asks about any software it is thinking of depending on: *what happens if
the person who can ship a fix is unavailable?*

It is deliberately not aspirational. Everything below describes the project as
it is on the day you read it in git history, not a structure the project hopes
to grow into.

## Roster

| Person | Contact | GitHub | Role | Since |
| --- | --- | --- | --- | --- |
| Joel Parker Henderson | <joel@joelparkerhenderson.com> | [@joelparkerhenderson](https://github.com/joelparkerhenderson) | Maintainer (sole) | 2026-03-13 |

**The bus factor of this project is one.** There is exactly one person with
write access to the repository, one person who can publish the site, and one
person who can accept a pull request. No second maintainer exists, no
organization stands behind the project, and no legal entity is a party to it.

Everything else in this file follows from that sentence, and no wording
elsewhere in the repository should be read as softening it. The path out is in
[`GOVERNANCE.md`](GOVERNANCE.md): becoming a maintainer is a defined route, and
it is open.

## Publishing identities and where they live

These are the credentials and configured identities that can put bytes in front
of a reader. Naming them is the point: an inventory nobody has written down is
an inventory nobody can hand over.

| Identity | What it publishes | Held by | Recovery if the holder is unavailable |
| --- | --- | --- | --- |
| The GitHub account and the `FormExamples` organization | everything: the repository, issues, settings, and the `main` branch the site builds from | the maintainer | none beyond GitHub's own account-recovery process, which is between GitHub and the account holder |
| `GITHUB_TOKEN` (ephemeral, per workflow run) | the GitHub Pages deployment of `formexamples.com` | GitHub, minted per run; nothing is stored | not applicable — there is no credential to lose |
| The `formexamples.com` domain | the documentation site's DNS | the maintainer (registrar account) | none: registrar account recovery only |
| The Codeberg and GitLab mirrors | a push mirror of the same history | the maintainer | not applicable — they are copies, and their value is that they survive independently |

**The honest reading of that table:** every publishing identity terminates at
one person's accounts. That is the residual risk, and it is stated rather than
mitigated, because no mitigation is available to a one-person project without a
legal entity behind it.

Two things reduce the blast radius, and they are worth naming because they are
real rather than promised. Nothing here is a package: no crate, no npm module,
no container image is published from this repository, so there is no registry
namespace to lose and no downstream install that breaks when an account goes
quiet. And the history is mirrored to Codeberg and GitLab, so the work survives
the loss of any single host.

## If the maintainer is unavailable

There is no succession plan that a document can create. What exists instead:

- **Nothing already published disappears.** The git history is public and
  mirrored on three hosts. A checkout you already have keeps working; nothing
  in this repository phones home, and no form calls a network service to score
  itself.
- **Nothing new ships.** No fix, no new form, no site rebuild.
- **The work is not lost.** The licence permits forking under its terms, the
  history is public, every gate is a committed script, and every design decision
  is in the tree. A fork is a complete and legitimate continuation, and the
  project's position is that it should be taken rather than waited on.
- **A vulnerability report has a fallback.** If a private report receives no
  acknowledgement within the window [`SECURITY.md`](SECURITY.md) commits to,
  that policy already tells you to escalate publicly, and publishing becomes
  your call. That path does not depend on the maintainer.

If you are considering depending on this repository for anything that matters,
and that position is not acceptable to you (it reasonably may not be), the
mitigation is on your side of the boundary: vendor what you use, keep a fork you
can build, and budget for maintaining it. That is a truthful answer, and it is
more useful than a continuity plan with nobody behind it.

## Adding a maintainer

The route is in [`GOVERNANCE.md`](GOVERNANCE.md). When someone takes it, this
file gains a row, [`CODEOWNERS`](CODEOWNERS) gains their handle on the areas
they own, and the table above gains a second holder wherever the identity
permits one. Those three edits are the whole mechanism.
