<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the M1 form and the clinician
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-m1-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">UK DVLA M1 Form</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Confidential medical information — mental health</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The DVLA M1 form is a single continuous wizard — personal details, healthcare professionals,
			diagnosis confirmation, mental health conditions, recent contact, and the applicant's
			authorisation — that captures the information the Drivers Medical Group at DVLA Swansea needs
			to assess fitness to drive in relation to a mental health condition, validated by a shared
			engine for completeness and consistency (applying the conditional Q1 = No stop rule) and
			flagged for clinical safety.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new form</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step M1 form. One continuous single-page wizard that validates your answers
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted M1 forms with their reported diagnosis, condition count, highest clinical
				flag priority, and completeness, and filter by priority and diagnosis.
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
					Capture a structured mental-health driving-fitness declaration and produce a validated
					report — completeness, consistency, and clinical safety flags — to support the DVLA
					medical assessor's review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validation rules, and the
					Q1 = No conditional stop. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the UK Driver and Vehicle Licensing Agency (DVLA) M1 confidential medical
					information questionnaire for mental health conditions.
				</dd>
			</div>
		</dl>
	</section>
</main>
