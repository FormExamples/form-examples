<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the coaching
	// dashboard. The collection routes (`/agile-principles-assessments` and
	// `/agile-principles-assessments/new`) hold the actual functionality.
	const plural = 'agile-principles-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Agile Principles Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Agility maturity self-assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Score your team or organisation against the 12 principles of the Agile Manifesto in a single
			continuous wizard: respondent context, a 1–5 Likert rating plus optional comment for each
			principle, and a summary with weighting and an action plan. The shared engine computes a
			composite agility maturity level, fires per-principle coaching rules, and surfaces operational
			flags such as burnout risk, technical-debt risk, and command-and-control culture.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/agile-principles-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades your
				team's agility as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/agile-principles-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Coaching dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed teams with their computed composite maturity, mean score, and flag counts,
				and filter by maturity and respondent role.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture a structured agility self-report and produce a graded result — composite maturity,
					per-principle bands, and flagged operational risks — to seed coaching conversations and
					retrospective items.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the composite maturity engine,
					and the coaching/flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the Manifesto for Agile Software Development and the 12 principles behind it (Beck
					et al., 2001). Treat results as an input to coaching, not a final verdict.
				</dd>
			</div>
		</dl>
	</section>
</main>
