<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the checklist form and the coach
	// dashboard. The collection routes (`/agile-checklists` and
	// `/agile-checklists/new`) hold the actual functionality.
	const plural = 'agile-checklists';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Agile Checklist</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Agile maturity self-assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Audit 57 concrete agile behaviours across three sections — Teams (25), Stakeholders (14), and
			Practices (18) — in a single continuous wizard. Each item is answered yes / no / not-applicable.
			The shared engine computes a per-section percentage of "yes" answers, derives a composite
			agility maturity level (Optimising, Mature, Developing, Initial, Ad-hoc), fires per-section
			coaching rules, and surfaces operational flags such as finished-work risk, experimentation
			blocked, and psychological-safety risk.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/agile-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new checklist</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step checklist form. One continuous single-page wizard that grades the team
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/agile-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Coach dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed teams with their computed composite maturity, overall percentage, and
				per-section bands, and filter by maturity and weak section.
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
					Capture observable agile behaviour and produce a graded coaching report — composite
					maturity, per-section bands, fired coaching rules, and operational flags — to seed
					retrospective experiments and coaching conversations.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the 57 items, the maturity grading engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in the Manifesto for Agile Software Development and its principles, the Scrum
					Guide, and Large-Scale Scrum (LeSS). It measures behaviour, not intent.
				</dd>
			</div>
		</dl>
	</section>
</main>
