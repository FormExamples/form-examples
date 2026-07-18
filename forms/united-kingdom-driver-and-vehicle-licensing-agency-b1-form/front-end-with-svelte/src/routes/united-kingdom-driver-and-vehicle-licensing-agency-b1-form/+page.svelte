<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the B1 form and the clinician
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-b1-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">UK DVLA B1 Form</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Confidential medical information — neurological
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The DVLA B1 form is a single continuous wizard — personal details, healthcare professionals,
			condition history, treatment provider, blackouts, seizures and epilepsy, medication, VP shunt,
			daily living, double vision, eyesight, vehicle adaptations, and the applicant's authorisation —
			that collects the medical information the UK Driver and Vehicle Licensing Agency requires to
			assess fitness to drive following a neurological condition, validated by a shared engine for
			completeness and flagged for clinician review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new form</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step B1 form. One continuous single-page wizard that checks the declaration
				for completeness as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted B1 forms with their completeness status, declared conditions, epilepsy
				declaration, and flag counts, and filter by status and epilepsy.
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
					Capture a structured neurological declaration and produce a completeness report —
					outstanding fields and flagged issues — to support DVLA medical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness validator
					(honouring the form's conditional logic), and the flag rules. The same engine drives both
					the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the DVLA B1 — Confidential medical information (neurological) form, including the
					epilepsy declaration and the applicant's authorisation.
				</dd>
			</div>
		</dl>
	</section>
</main>
