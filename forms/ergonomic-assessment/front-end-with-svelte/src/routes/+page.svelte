<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the assessor
	// dashboard. The collection routes (`/ergonomic-assessments` and
	// `/ergonomic-assessments/new`) hold the actual functionality.
	const plural = 'ergonomic-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Ergonomic Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Workplace ergonomic evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A workplace ergonomic evaluation completed as a single continuous wizard: worker demographics,
			workstation setup, posture assessment, repetitive tasks, manual handling, and current symptoms.
			The shared engine grades musculoskeletal risk with the REBA (Rapid Entire Body Assessment)
			instrument, derives a risk level and recommended action, and flags issues for the assessor.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				worker as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Assessor dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed workers with their computed REBA score and risk level, and filter by risk
				level and reported impact on work.
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
					Capture a structured ergonomic profile and produce a graded report — REBA score, risk
					level, recommended action, and flagged issues — to support occupational health review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the REBA grading engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Rapid Entire Body Assessment (REBA) for musculoskeletal risk, scoring 1
					(negligible) to 15 (very high), with action levels from no action to immediate change.
				</dd>
			</div>
		</dl>
	</section>
</main>
