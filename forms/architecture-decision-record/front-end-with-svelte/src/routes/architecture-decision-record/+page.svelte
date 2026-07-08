<script lang="ts">
	// Welcome page: explains the work and links to the two working surfaces —
	// the ADR authoring wizard and the decision register.
	const plural = 'architecture-decision-records';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Architecture Decision Record</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Capture an architecture decision</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Record an Architecture Decision Record (ADR) using the Tyree &amp; Akerman 14-section template
			as a single continuous wizard: author and organization context, issue, decision, status and
			group, assumptions, constraints, the positions (alternatives) considered, argument, implications,
			the related decisions / requirements / artifacts / principles, notes, and sign-off. A pure
			completeness-and-status engine measures how fully the template is filled in, surfaces the chosen
			position, and flags governance gaps such as an approved record with no sign-off.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/architecture-decision-record/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step ADR form. One continuous single-page wizard that scores completeness as
				you complete it and renders a Markdown ADR.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/architecture-decision-record/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Decision register</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded decisions with their status, group, completeness, and open governance flags,
				and filter by status and group.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the register →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture a structured architecture decision and produce a report — status, completeness, the
					chosen position, flags, and a commit-ready Markdown ADR.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness/status engine,
					and the flag rules. The same engine scores both the form and the register.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Tyree &amp; Akerman ADR template (not MADR). The Markdown output is ready to commit
					to <code>docs/adr/NNNN-slug.md</code>.
				</dd>
			</div>
		</dl>
	</section>
</main>
