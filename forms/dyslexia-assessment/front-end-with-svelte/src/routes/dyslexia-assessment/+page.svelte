<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/dyslexia-assessments` and
	// `/dyslexia-assessments/new`) hold the actual functionality.
	const plural = 'dyslexia-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Dyslexia Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Specific learning difficulty evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured dyslexia evaluation completed as a single continuous wizard: demographics,
			developmental history, educational background, reading, writing and spelling, phonological
			processing, working memory and processing speed, emotional and behavioural impact, previous
			support, and a recommendations and support plan. The shared engine classifies each domain's
			standardised score (mean 100, SD 15), derives an overall severity from the most-impaired
			domain, and flags issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/dyslexia-assessment/{plural}/new"
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
			href="/dyslexia-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their lowest standardised score, computed severity, and family
				history, and filter by severity and family history.
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
					Capture a structured profile of reading, writing, spelling, phonological processing,
					working memory, and processing speed, then produce a graded report — overall severity,
					per-domain scores, and flagged issues — to support clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the standardised-score grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses a standardised score battery (mean 100, SD 15) with severity bands: 85+ average (no
					dyslexia), 70-84 below average (mild), 55-69 well below average (moderate), and below 55
					significantly below average (severe).
				</dd>
			</div>
		</dl>
	</section>
</main>
