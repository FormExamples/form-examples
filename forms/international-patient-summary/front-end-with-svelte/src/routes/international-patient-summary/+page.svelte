<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the IPS form and the clinician
	// dashboard. The collection routes (`/international-patient-summaries` and
	// `/international-patient-summaries/new`) hold the actual functionality.
	const plural = 'international-patient-summaries';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/international-patient-summary/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new IPS</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step IPS form. One continuous single-page wizard that validates completeness as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/international-patient-summary/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse compiled patient summaries with their computed completeness level and populated-section
				counts, and filter by completeness and allergy status.
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
					Capture a patient's core clinical facts in a minimal, specialty-agnostic format —
					demographics, problem list, medication summary, allergies and intolerances, immunisations,
					procedures, results and investigations, medical devices, advance directives and consent,
					and authoring clinician signoff — and produce a graded report: completeness level,
					per-section audit trail, and flagged issues, to support cross-border and unplanned care.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the IPS completeness validation
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Conforms to ISO 27269:2021 (International Patient Summary) and the HL7 FHIR IPS Implementation
					Guide (R4 and R5); uses SNOMED CT, ICD-10, and ATC clinical terminologies.
				</dd>
			</div>
		</dl>
	</section>
</main>
