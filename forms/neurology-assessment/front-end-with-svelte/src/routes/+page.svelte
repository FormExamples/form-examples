<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/neurology-assessments` and
	// `/neurology-assessments/new`) hold the actual functionality.
	const plural = 'neurology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Neurology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Neurological evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive neurological evaluation completed as a single continuous wizard: demographics,
			chief complaint, NIHSS stroke-scale assessment, headache, seizure history, motor and sensory
			exam, cognition, medications, diagnostic results, and functional / social status. The shared
			engine scores the patient on the NIH Stroke Scale (NIHSS), summarises the modified Rankin
			Scale disability, and flags safety-critical issues for the neurologist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
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
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed NIHSS score and severity band, and filter by
				severity and anticoagulant status.
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
					Capture a structured neurological profile and produce a scored report — NIHSS total,
					severity band, item scores, and flagged issues — to support neurology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the NIHSS scoring engine, and
					the safety-flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the National Institutes of Health Stroke Scale (NIHSS, 0–42) and the modified Rankin
					Scale (mRS) for functional disability.
				</dd>
			</div>
		</dl>
	</section>
</main>
