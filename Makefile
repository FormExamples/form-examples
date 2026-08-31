# claude mcp add -t stdio -s project svelte -- npx -y @sveltejs/mcp

.PHONY: github-pages

# Publish formexamples.github.io/ to the sibling, top-level, read-only
# github.com/FormExamples/formexamples.github.io repo, per
# spec/monorepo-github-pages/. Pushes a subdirectory of this repo out to
# the main branch on the remote named github-pages, using git's subtree
# mechanism (see bin/publish-github-pages-subtree for the version that
# also adds the github-pages remote if it's missing, e.g. on a fresh
# clone, and supports --dry-run).
github-pages:
	git subtree push --prefix=formexamples.github.io github-pages main
