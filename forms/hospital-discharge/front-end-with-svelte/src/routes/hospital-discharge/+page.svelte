<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the discharge summary form and the
	// clinician dashboard. The collection routes (`/hospital-discharges` and
	// `/hospital-discharges/new`) hold the actual functionality.
	const plural = 'hospital-discharges';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Hospital Discharge</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Discharge summary &amp; safe transfer of care</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A hospital discharge summary completed as a single continuous wizard: patient details,
			admission summary, diagnoses, procedures, reconciled discharge medications, follow-up
			arrangements, community care instructions, warning signs and safety-netting, clinician sign-off,
			and patient / carer acknowledgement. The shared engine validates the summary against NICE NG27
			completeness rules, classifies it as Complete, Partial or Incomplete, and raises safety flags
			for the receiving clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hospital-discharge/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new discharge summary</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that checks NICE NG27
				completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hospital-discharge/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse discharge summaries with their computed completeness level, outstanding mandatory
				fields, follow-up arrangement and safety flags, and filter by completeness and destination.
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
					Capture a structured discharge summary and produce a graded report — NICE NG27
					completeness level, outstanding fields, and flagged safety issues — to support safe
					transfer of care to the GP and community teams.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the NICE NG27 completeness
					validation engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with UK NICE NG27 (transition between inpatient hospital settings and community or
					care home settings) and the SAFER patient-flow bundle.
				</dd>
			</div>
		</dl>
	</section>
</main>
