# Trusted Publishing

Status: **recorded as policy** as of 2026-08-28; **not yet applicable** — see
below.

Trusted Publishing is a secure way to publish your Rust crates from CI/CD platforms like GitHub Actions and GitLab CI/CD without manually managing API tokens. It uses OpenID Connect (OIDC) to verify that your workflow is running from your repository, then provides a short-lived token for publishing.

Instead of storing long-lived API tokens in your repository secrets, Trusted Publishing allows your CI/CD platform to authenticate directly with crates.io using cryptographically signed tokens that prove the workflow's identity.

We intend to add "Trusted Publishing" when it is production-ready across all our code forges (GitHub.com, GitLab.com, Codeberg.org, etc.) and across all our target destinations (Rust crates.io, NPM npmjs.com, etc.).

## Why this is policy, not a task with a checklist

This is a general supply-chain stance, not a form-examples-specific
commitment. This repository does not publish a package today, and
[`INSTALL.md`](../../INSTALL.md) is explicit that it never will — no crate to
crates.io, no module to npm, no image to a container registry
([`MAINTAINERS.md`](../../MAINTAINERS.md)). There is currently no publishing
token, long-lived or otherwise, in scope for Trusted Publishing to replace
here.

The policy is recorded anyway, in [`SECURITY.md`](../../SECURITY.md), because
it is the kind of decision worth having made *before* it is needed: if this or
any future project of this maintainer's does publish a package from CI,
Trusted Publishing — not a stored API token — is the intended mechanism, and
that should be true from the first commit that publishes anything, not
retrofitted after a token leaks.

There is nothing further to implement here unless and until that changes.
