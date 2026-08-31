# claude mcp add -t stdio -s project svelte -- npx -y @sveltejs/mcp

.PHONY: github-pages

# Publish formexamples.github.io/ to the sibling, top-level, read-only
# github.com/FormExamples/formexamples.github.io repo, per
# spec/monorepo-github-pages/. Delegates to bin/make-github-pages, a POSIX
# shell script that runs
#   git subtree push --prefix=formexamples.github.io github-pages main
# (and, unlike this target alone, adds the github-pages remote first if
# it's missing — e.g. on a fresh clone — and supports --dry-run).
github-pages:
	bin/make-github-pages
