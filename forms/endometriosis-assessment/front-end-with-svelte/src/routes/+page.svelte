<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/endometriosis-assessments` and
	// `/endometriosis-assessments/new`) hold the actual functionality.
	const plural = 'endometriosis-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Endometriosis Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Endometriosis evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive endometriosis evaluation completed as a single continuous wizard: demographics,
			menstrual history, pain assessment, gastrointestinal and urinary symptoms, fertility, previous
			treatments, surgical history, quality-of-life impact, and treatment planning. The shared engine
			grades the patient with the revised ASRM staging and the EHP-30 quality-of-life score, derives
			an overall severity, and flags issues for the gynaecologist.
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
				Browse assessed patients with their computed ASRM stage, EHP-30 score, and overall severity,
				and filter by severity and ASRM stage.
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
					Capture a structured endometriosis profile and produce a graded report — ASRM stage,
					EHP-30 quality-of-life score, overall severity, and flagged issues — to support
					gynaecology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the ASRM / EHP-30 grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the revised American Society for Reproductive Medicine (ASRM) endometriosis staging
					and the Endometriosis Health Profile-30 (EHP-30) quality-of-life instrument.
				</dd>
			</div>
		</dl>
	</section>
</main>
