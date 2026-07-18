<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the V1 form and the clinician
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-v1-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">UK DVLA V1 Form</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Confidential medical information — vision
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The DVLA V1 form is a single continuous wizard — personal details, healthcare professionals,
			and eleven vision questions covering the eyesight standard, monocular vision, visual field,
			glaucoma, retinitis pigmentosa, laser treatment, blepharospasm, night blindness, double vision,
			other conditions, and recent contact, plus the applicant's authorisation — that collects the
			vision self-declaration the UK Driver and Vehicle Licensing Agency requires to assess fitness
			to drive, validated by a shared engine for completeness (honouring the form's conditional
			logic) and flagged for clinician review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new form</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step V1 form. One continuous single-page wizard that checks the declaration
				for completeness as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted V1 forms with their completeness status, eyesight-standard self-declaration,
				declared vision conditions, and flag counts, and filter by status and eyesight standard.
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
					Capture a structured vision self-declaration and produce a completeness report —
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
					Based on the DVLA V1 — Confidential medical information (vision) form, including the
					monocular and double-vision declarations and the applicant's authorisation.
				</dd>
			</div>
		</dl>
	</section>
</main>
