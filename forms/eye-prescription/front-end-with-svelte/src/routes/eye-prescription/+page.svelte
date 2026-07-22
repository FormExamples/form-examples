<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the prescription form and the clinician
	// dashboard. The collection routes (`/eye-prescriptions` and
	// `/eye-prescriptions/new`) hold the actual functionality.
	const plural = 'eye-prescriptions';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/eye-prescription/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new prescription</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step prescription form. One continuous single-page wizard that classifies the
				refraction as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/eye-prescription/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse issued prescriptions with their computed complexity grade and safety-flag counts, and
				filter by complexity and lens type.
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
					Capture a structured spectacle prescription — prescriber and patient identification,
					examination details, visual acuity, per-eye refraction (sphere, cylinder, axis, addition,
					prism), pupillary distance, lens recommendation, and optional ocular-health findings — and
					produce a graded report: per-eye refractive classification, overall complexity, and
					flagged safety issues, to support dispensing and clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the refractive classification
					and complexity engine, and the safety-flag rules. The same engine grades both the form and
					the dashboard. Cylinder is stored in minus-cylinder convention.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the General Optical Council Standards of Practice, the College of Optometrists
					Clinical Management Guidelines, and the HL7 FHIR R5 VisionPrescription resource.
				</dd>
			</div>
		</dl>
	</section>
</main>
