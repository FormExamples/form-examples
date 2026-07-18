<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/stroke-assessments` and
	// `/stroke-assessments/new`) hold the actual functionality.
	const plural = 'stroke-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Stroke Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Acute stroke evaluation (NIHSS)</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured, single-page wizard covering symptom onset and timing, level of consciousness,
			gaze and visual fields, facial palsy and motor function, limb ataxia and sensory loss, language
			and dysarthria, extinction and inattention, and risk factors, from which the shared engine
			scores the patient on the National Institutes of Health Stroke Scale (NIHSS, 0–42), classifies
			stroke severity, and flags issues for the stroke team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/stroke-assessment/{plural}/new"
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
			href="/stroke-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed NIHSS score and stroke severity, and filter by
				severity and atrial fibrillation status.
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
					Capture a structured stroke examination and produce a graded report — the NIHSS score,
					stroke severity category, and flagged issues — to support acute stroke management.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the NIHSS scoring engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the National Institutes of Health Stroke Scale (NIHSS), a validated 15-item instrument
					(total score 0–42) for quantifying acute stroke severity.
				</dd>
			</div>
		</dl>
	</section>
</main>
