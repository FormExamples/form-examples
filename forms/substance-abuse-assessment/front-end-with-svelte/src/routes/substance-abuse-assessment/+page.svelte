<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/substance-abuse-assessments` and
	// `/substance-abuse-assessments/new`) hold the actual functionality.
	const plural = 'substance-abuse-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Substance Abuse Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Substance use disorder evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive, single-page wizard covering alcohol use, drug use, substance use history,
			withdrawal, mental-health comorbidities, and social / physical-health impact, from which the
			shared engine scores the AUDIT (0-40) and DAST-10 (0-10) instruments, derives an overall risk
			level, and flags safety-critical issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/substance-abuse-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/substance-abuse-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed AUDIT and DAST-10 scores and overall risk level,
				and filter by risk and AUDIT category.
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
					Capture a structured substance use profile and produce a graded report — AUDIT score and
					category, DAST-10 score and category, overall risk, and flagged issues — to support
					clinical review and treatment planning.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the AUDIT / DAST-10 scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the WHO Alcohol Use Disorders Identification Test (AUDIT) and the Drug Abuse Screening
					Test (DAST-10), combined into an overall biopsychosocial risk level.
				</dd>
			</div>
		</dl>
	</section>
</main>
