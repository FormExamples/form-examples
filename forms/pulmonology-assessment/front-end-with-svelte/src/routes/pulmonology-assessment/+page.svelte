<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/pulmonology-assessments` and
	// `/pulmonology-assessments/new`) hold the actual functionality.
	const plural = 'pulmonology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Pulmonology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Respiratory evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive respiratory evaluation completed as a single continuous wizard, staged by
			the shared engine with the GOLD (Global Initiative for Chronic Obstructive Lung Disease)
			classification and ABCD assessment group.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/pulmonology-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that stages the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/pulmonology-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed GOLD stage and ABCD group, and filter by stage
				and group.
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
					Capture a structured respiratory profile — demographics, chief complaint, spirometry,
					symptom assessment, exacerbation history, medications, allergies, comorbidities,
					smoking and exposures, and functional status — and produce a graded report — GOLD
					stage, ABCD group, and flagged issues — to support pulmonology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the GOLD staging engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses GOLD spirometric staging (I-IV) on FEV1 % predicted with a confirmed FEV1/FVC ratio
					&lt; 0.7, plus the ABCD assessment groups derived from CAT / mMRC symptom burden and
					exacerbation history.
				</dd>
			</div>
		</dl>
	</section>
</main>
