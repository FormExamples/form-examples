<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the audit checklist form and the
	// safety dashboard. The collection routes (`/workplace-safety-assessments`
	// and `/workplace-safety-assessments/new`) hold the actual functionality.
	const plural = 'workplace-safety-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Workplace Safety Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">UK HSE-aligned workplace safety audit</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A workplace safety audit for healthcare settings whose shared engine grades each item Yes / No /
			N/A against UK Health and Safety Executive (HSE) standards to derive an overall audit outcome
			and flag issues for the auditor.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/workplace-safety-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new audit</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step checklist. One continuous single-page wizard that grades the site as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the checklist →</span>
		</a>
		<a
			href="/workplace-safety-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Safety dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse audited sites with their computed outcome, finding counts and flags, and filter by
				outcome and critical findings.
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
					Capture a structured workplace safety audit — site details, PPE &amp; hazard controls,
					chemical &amp; biological hazards, electrical safety, fire safety &amp; emergency egress,
					ergonomics &amp; manual handling, emergency procedures, training &amp; competence,
					incident reporting, and sign-off &amp; action plan — and produce a graded report —
					overall outcome, findings by category, and flagged issues — to support corrective action
					planning and the local risk register.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the severity-graded scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the UK Health and Safety Executive (HSE) audit framework, COSHH 2002, and
					RIDDOR 2013. Outcomes: Compliant, Minor Findings (90 days), Major Findings (30 days),
					Critical Findings (immediate, RIDDOR-reportable where applicable).
				</dd>
			</div>
		</dl>
	</section>
</main>
