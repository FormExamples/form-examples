<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/palliative-assessments` and
	// `/palliative-assessments/new`) hold the actual functionality.
	const plural = 'palliative-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Palliative Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Symptom-focused palliative care review</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A holistic palliative assessment, completed as a single continuous wizard, that scores the
			patient with the Edmonton Symptom Assessment System-revised (ESAS-r), derives an overall
			symptom-burden band, and flags issues for the palliative team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/palliative-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/palliative-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Palliative MDT dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their ESAS-r totals, severity bands, performance status, and
				safety flags, and filter by severity and PPS band.
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
					Capture a structured palliative profile and produce a graded report — ESAS-r total,
					symptom-burden band, severe-symptom flags, and clinician-facing issues — to support
					individualised palliative management.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the ESAS-r grading engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Edmonton Symptom Assessment System-revised (ESAS-r): ten symptoms scored 0-10,
					total 0-100, banded None / Mild / Moderate / Severe, with any single symptom ≥ 7 flagged
					for urgent review.
				</dd>
			</div>
		</dl>
	</section>
</main>
