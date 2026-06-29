<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/psychology-assessments` and
	// `/psychology-assessments/new`) hold the actual functionality.
	const plural = 'psychology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Psychology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">DASS-21 psychological screening</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A self-report psychological screen completed as a single continuous wizard: demographics, reason
			for assessment, the 21-item Depression Anxiety Stress Scales (DASS-21), functional impact, a
			brief safety screen, and support / history. The shared engine scores each DASS-21 subscale,
			assigns a severity category from the published DASS norms, and escalates safety flags — including
			suicidal ideation — for urgent clinician review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step questionnaire. One continuous single-page wizard that scores the
				DASS-21 subscales as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Depression / Anxiety / Stress severities and
				risk flags, and filter by severity and suicidal-ideation flag.
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
					Capture a structured DASS-21 self-report and produce a graded report — Depression, Anxiety,
					and Stress severities plus flagged safety issues — to support psychological review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the DASS-21 scoring engine, and
					the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the DASS-21 (Lovibond &amp; Lovibond, 1995), a public-domain instrument; subscale raw
					scores are doubled to align with the published DASS-42 normative cutoffs.
				</dd>
			</div>
		</dl>
	</section>
</main>
