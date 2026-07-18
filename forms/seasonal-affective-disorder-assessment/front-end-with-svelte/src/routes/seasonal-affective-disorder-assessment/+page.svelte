<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'seasonal-affective-disorder-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Seasonal Affective Disorder Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Seasonal mood disorder evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured seasonal-mood evaluation completed as a single continuous wizard, scored by the
			shared engine's SPAQ Global Seasonality Score (GSS) and PHQ-9 depression severity into a
			combined severity classification.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/seasonal-affective-disorder-assessment/{plural}/new"
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
			href="/seasonal-affective-disorder-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed SPAQ GSS, PHQ-9 score, and combined severity,
				and filter by severity and seasonality band.
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
					Capture a structured seasonal-mood profile — demographics, seasonal pattern history,
					current mood (PHQ-9), sleep and energy, appetite and weight, social and occupational
					impact, light exposure, previous treatments, risk assessment, and treatment plan — and
					produce a graded report — SPAQ GSS band, PHQ-9 severity, combined severity, and flagged
					issues — to support clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the SPAQ + PHQ-9 grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Seasonal Pattern Assessment Questionnaire (SPAQ) Global Seasonality Score and the
					PHQ-9 depression severity instrument.
				</dd>
			</div>
		</dl>
	</section>
</main>
