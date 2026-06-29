<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'predicting-risk-of-cardiovascular-disease-events-records';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">PREVENT CVD Risk Calculator</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Predicting Risk of Cardiovascular Disease Events</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Estimate 10-year and 30-year risk of total cardiovascular disease for adults aged 30–79 without
			known CVD, using the AHA PREVENT equations. Completed as a single continuous wizard:
			demographics, blood pressure, cholesterol and lipids, metabolic health, renal function, smoking
			history, medical history, medications, and review. The shared engine computes the risk category,
			10- and 30-year risk percentages, the rules that fired, and flagged issues for the clinician.
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
				patient's CVD risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed risk category and 10-/30-year risk estimates,
				and filter by risk category and diabetes status.
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
					Capture a structured cardiovascular risk profile and produce a graded report — risk
					category, 10- and 30-year CVD risk, fired rules, and flagged issues — to support primary
					prevention review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the PREVENT risk-estimation
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the American Heart Association PREVENT equations (2023) for primary prevention in
					adults aged 30–79 without known cardiovascular disease.
				</dd>
			</div>
		</dl>
	</section>
</main>
