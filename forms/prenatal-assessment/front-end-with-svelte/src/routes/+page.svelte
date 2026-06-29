<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/prenatal-assessments` and
	// `/prenatal-assessments/new`) hold the actual functionality.
	const plural = 'prenatal-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Prenatal Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Antenatal evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive antenatal evaluation completed as a single continuous wizard: demographics,
			pregnancy details, obstetric history, medical history, current symptoms, vital signs, laboratory
			results, lifestyle and nutrition, mental health screening, and birth-plan preferences. The shared
			engine computes a cumulative pregnancy-risk score, stratifies the patient into a risk level, and
			flags safety-critical issues for the obstetrician.
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
				Browse assessed patients with their computed risk score and risk level, and filter by risk
				level and multiple gestation.
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
					Capture a structured antenatal profile and produce a graded report — cumulative risk score,
					risk level, and flagged issues — to support obstetric review and care planning.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the cumulative risk-scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Risk weights span obstetric, medical, pregnancy, vital-sign, laboratory, lifestyle, mental
					health, and current-symptom factors; the Edinburgh Postnatal Depression Scale screens
					mental health.
				</dd>
			</div>
		</dl>
	</section>
</main>
