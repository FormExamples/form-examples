# claude mcp add -t stdio -s project svelte -- pnpm dlx @sveltejs/mcp

.PHONY: github-pages test-minimum-supported-rust-version

# Publish formexamples.github.io/ to the sibling, top-level, read-only
# github.com/FormExamples/formexamples.github.io repo, per
# spec/monorepo-github-pages/. Delegates to bin/make-github-pages, a POSIX
# shell script that runs
#   git subtree push --prefix=formexamples.github.io github-pages main
# (and, unlike this target alone, adds the github-pages remote first if
# it's missing — e.g. on a fresh clone — and supports --dry-run).
github-pages:
	bin/make-github-pages

# Check and test every Axum crate on the minimum supported Rust version (N-2)
# and the version after it (N-1). Delegates to
# bin/make-test-minimum-supported-rust-version; pass slugs with
#   bin/make-test-minimum-supported-rust-version <slug>…
# to run a subset.
test-minimum-supported-rust-version:
	bin/make-test-minimum-supported-rust-version
