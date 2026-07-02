<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review form and the clinician
	// dashboard.
	const plural = 'chronic-obstructive-pulmonary-disease-reviews';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Chronic Obstructive Pulmonary Disease Review
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">COPD annual review</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK primary-care annual review for adults with confirmed COPD, completed as a single
			continuous wizard. It records spirometry, symptom burden, exacerbation history, smoking,
			inhaler technique and adherence, vaccinations, pulmonary rehabilitation, oxygen,
			comorbidities, and the self-management plan. This is a
			<strong>severity-classification and completeness</strong> instrument, not a numeric score: the
			engine derives a <strong>GOLD airflow-limitation grade (1–4)</strong>, a combined
			<strong>ABE assessment group</strong>, a <strong>review-completeness grade</strong>
			(complete / partial / incomplete), and clinical flags. Aligned with NICE NG115 and GOLD 2023+.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step COPD review. One continuous single-page wizard that classifies GOLD
				grade, ABE group, and review completeness on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed GOLD grade, ABE group, and completeness, and
				filter by GOLD grade and ABE group.
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
					Capture the COPD annual review and produce a graded report — a GOLD airflow-limitation
					grade, an ABE assessment group, a review-completeness grade, and flagged issues — to
					support the clinical record and prompt escalation where risk is flagged.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the grading engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NICE NG115 and the GOLD strategy (2023+), with the CAT and mMRC dyspnoea
					instruments. A documentation and severity-classification aid, not a diagnosis, and not a
					replacement for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
