<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the encounter form and the clinician
	// dashboard. The collection routes (`/who-prehospital-forms` and
	// `/who-prehospital-forms/new`) hold the actual functionality.
	const plural = 'who-prehospital-forms';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/who-prehospital-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new encounter</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step run sheet. One continuous single-page wizard that checks completeness
				and flags issues as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/who-prehospital-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded encounters with their triage category, completeness status, and flag counts,
				and filter by triage and completeness.
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
					Capture a structured prehospital record — caller and scene, chief complaint and initial
					vitals, high-risk signs, RED / YELLOW / GREEN triage, the systematic ABCDE primary survey
					and interventions, SAMPLE history, injury details, physical exam, additional
					interventions, assessment and plan, reassessments, and disposition with handover — and
					produce a handover report — triage category, completeness status, outstanding fields, and
					flagged issues — for the receiving facility.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness rules, and the
					flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the World Health Organization Prehospital Form (SCF Prehospital), using the ABCDE
					systematic assessment approach and WHO triage categories.
				</dd>
			</div>
		</dl>
	</section>
</main>
