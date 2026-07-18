<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/pediatric-assessments` and
	// `/pediatric-assessments/new`) hold the actual functionality.
	const plural = 'pediatric-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Pediatric Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Child development screening</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive paediatric evaluation, completed as a single continuous wizard, that grades
			the child with a developmental screen &mdash; Normal, Concern, or Delay across five core
			domains &mdash; and flags safety-critical issues for the paediatrician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/pediatric-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that screens the
				child as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/pediatric-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse screened children with their computed developmental screen result and flag count, and
				filter by screen result and immunisation status.
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
					Capture a structured paediatric profile and produce a graded report — developmental screen
					result, per-domain outcomes, and flagged issues — to support paediatric review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the developmental screening
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Screens five core developmental domains — gross motor, fine motor, language,
					social-emotional, and cognitive — alongside growth percentiles and birth history.
				</dd>
			</div>
		</dl>
	</section>
</main>
