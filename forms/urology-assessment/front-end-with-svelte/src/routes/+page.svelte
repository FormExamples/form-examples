<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/urology-assessments` and
	// `/urology-assessments/new`) hold the actual functionality.
	const plural = 'urology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Urology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Lower urinary tract evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive urological evaluation completed as a single continuous wizard: demographics,
			chief complaint, the IPSS (International Prostate Symptom Score) questionnaire, quality of life,
			urinary symptoms, renal function, sexual health, medical history, current medications, and family
			history. The shared engine computes the IPSS total (0–35) and its severity category, captures the
			quality-of-life score, and flags safety-critical issues for the urologist.
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
				Browse assessed patients with their computed IPSS score, symptom severity, and quality of
				life, and filter by severity and referral urgency.
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
					Capture a structured urological profile and produce a graded report — IPSS total, symptom
					severity, quality of life, and flagged issues — to support urology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the IPSS scoring engine, and the
					flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the International Prostate Symptom Score (IPSS): 0–7 mild, 8–19 moderate, 20–35 severe
					lower urinary tract symptoms, with the IPSS quality-of-life question.
				</dd>
			</div>
		</dl>
	</section>
</main>
