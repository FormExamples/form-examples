<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/learning-disability-assessments` and
	// `/learning-disability-assessments/new`) hold the actual functionality.
	const plural = 'learning-disability-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Learning Disability Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Annual health check &amp; adaptive-functioning assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured annual health check completed as a single continuous wizard: demographics, carer
			and support network, communication needs, medical review, physical examination, adaptive
			functioning, behavioural concerns, mental capacity and consent, reasonable adjustments, and a
			personalised health action plan. The shared engine grades adaptive functioning into a DSM-5-TR
			aligned severity category (Mild / Moderate / Severe / Profound) and flags issues such as
			poorly-controlled epilepsy, psychotropic prescribing without a STOMP review, dysphagia, missed
			national screening, and mental-capacity concerns.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/learning-disability-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				person as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/learning-disability-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed severity category, IQ band, communication
				needs, and mental-capacity status, and filter by severity and communication need.
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
					Capture a structured learning-disability annual health check and produce a graded report —
					severity category, adaptive-functioning detail, and flagged issues — plus a personalised
					Health Action Plan with reasonable adjustments.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the adaptive-functioning
					scoring engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the NHS England Annual Health Check, DSM-5-TR / ICD-11 functional descriptors,
					the Mental Capacity Act 2005, and the Accessible Information Standard.
				</dd>
			</div>
		</dl>
	</section>
</main>
