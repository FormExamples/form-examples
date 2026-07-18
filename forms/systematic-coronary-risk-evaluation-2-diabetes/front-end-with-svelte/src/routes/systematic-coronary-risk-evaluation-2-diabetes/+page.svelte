<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'systematic-coronary-risk-evaluation-2-diabetes-records';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">SCORE2-Diabetes</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			10-year cardiovascular risk for adults with type 2 diabetes
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured, single-page wizard covering diabetes history, cardiovascular history, blood
			pressure, lipid profile, renal function, and lifestyle factors for adults with type 2 diabetes,
			from which the shared engine derives an overall 10-year cardiovascular risk category
			(SCORE2-Diabetes) and flags clinical safety issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/systematic-coronary-risk-evaluation-2-diabetes/{plural}/new"
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
			href="/systematic-coronary-risk-evaluation-2-diabetes/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed 10-year cardiovascular risk category and key
				measures, and filter by risk category and established CVD.
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
					Capture a structured diabetes cardiovascular profile and produce a graded report — overall
					risk category and flagged issues — to support clinical review and risk-factor management.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the risk-grading engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the European Society of Cardiology (ESC) 2023 SCORE2-Diabetes risk model, which
					extends SCORE2 with diabetes-specific predictors (HbA1c, eGFR, and age at diagnosis).
				</dd>
			</div>
		</dl>
	</section>
</main>
