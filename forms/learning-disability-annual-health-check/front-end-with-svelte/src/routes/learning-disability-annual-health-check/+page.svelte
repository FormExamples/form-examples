<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the annual-health-check form and the
	// clinician dashboard.
	const plural = 'learning-disability-annual-health-checks';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/learning-disability-annual-health-check/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new check</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step annual health check. One continuous single-page wizard that grades
				completeness and the Health Action Plan as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/learning-disability-annual-health-check/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse checked people with their computed completeness status, Health Action Plan, and STOMP
				flag, and filter by completeness and Health Action Plan.
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
					Record the annual health check — reasonable adjustments and communication, physical
					health, screening and immunisation uptake, a medication review including STOMP, mental
					health and behaviour, syndrome-specific checks, and carer and social circumstances —
					against its 18 required components, and produce a graded report: a complete / incomplete
					classification, a completeness percentage, the Health Action Plan status, and flagged
					issues, to support the health record and prompt action where a flag is raised.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness engine, the
					Health Action Plan gate, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NHS England's annual health check guidance, the RCGP / Cardiff University health
					check template, and the STOMP programme. A documentation and completeness aid, not a
					diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
