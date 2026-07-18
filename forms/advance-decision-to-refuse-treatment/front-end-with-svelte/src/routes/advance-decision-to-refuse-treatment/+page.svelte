<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the ADRT document form and the clinician
	// dashboard. The collection routes (`/advance-decisions-to-refuse-treatment`
	// and `/advance-decisions-to-refuse-treatment/new`) hold the functionality.
	const plural = 'advance-decisions-to-refuse-treatment';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Advance Decision to Refuse Treatment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Record treatment refusals in advance</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A legal document, completed as a single continuous wizard, that lets a person record decisions
			to refuse specific medical treatments in advance under the Mental Capacity Act 2005, checked by
			the shared engine for legal validity and flagged for clinical and legal review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/advance-decision-to-refuse-treatment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new ADRT</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step document form. One continuous single-page wizard that checks legal
				validity as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/advance-decision-to-refuse-treatment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded ADRTs with their computed validity status and life-sustaining refusal and
				witness flags, and filter by validity status and life-sustaining refusal.
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
					Capture a structured advance decision — personal details, mental-capacity declaration,
					circumstances, general and life-sustaining treatment refusals, exceptions, other wishes,
					lasting power of attorney, healthcare-professional review, and legal signatures — and
					produce a validity report: overall validity status, fired validity rules, and flagged
					issues, to support clinical and legal review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validity-checking engine,
					and the flag rules. The same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Validity is checked against the legal requirements of the Mental Capacity Act 2005,
					including the special requirements for refusing life-sustaining treatment.
				</dd>
			</div>
		</dl>
	</section>
</main>
