<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/endocrinology-assessments` and
	// `/endocrinology-assessments/new`) hold the actual functionality.
	const plural = 'endocrinology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Endocrinology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">General endocrinology consultation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive endocrine evaluation, completed as a single continuous wizard across the
			thyroid, adrenal, glucose, reproductive, pituitary, and bone / calcium axes, that the shared
			engine grades axis-by-axis into an overall endocrine status flagged for the endocrinologist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/endocrinology-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades each
				endocrine axis as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/endocrinology-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed overall endocrine status and abnormal-axis
				count, and filter by status and urgent flags.
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
					Capture a structured endocrine profile — demographics, presenting symptoms, axis review,
					medications and lifestyle, and clinical impression — and produce a graded report: each
					axis rated normal, subclinical, mild, moderate, or severe, an overall endocrine status,
					and flagged issues, to support endocrinology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-axis grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Endocrine Symptom &amp; Biochemical Review, aligned to NICE endocrinology
					guidance, across the thyroid, adrenal, glucose, reproductive, pituitary, and bone / calcium
					axes.
				</dd>
			</div>
		</dl>
	</section>
</main>
