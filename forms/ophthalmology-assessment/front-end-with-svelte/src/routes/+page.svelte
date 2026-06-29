<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/ophthalmology-assessments` and
	// `/ophthalmology-assessments/new`) hold the actual functionality.
	const plural = 'ophthalmology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Ophthalmology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Ophthalmic evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive ophthalmic evaluation completed as a single continuous wizard: demographics,
			chief complaint, visual acuity, ocular history, anterior and posterior segment examination,
			visual fields and pupils, medications, systemic conditions, and functional impact. The shared
			engine grades best-corrected visual acuity, derives a visual impairment grade, and flags
			safety-critical issues for the ophthalmologist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed visual acuity grade, IOP status, and flagged
				issues, and filter by VA grade and affected eye.
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
					Capture a structured ophthalmic profile and produce a graded report — visual acuity grade,
					IOP status, and flagged issues — to support ophthalmology review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the visual acuity grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses best-corrected visual acuity (Snellen) grading aligned with WHO visual impairment
					categories, intraocular pressure status, and ophthalmic safety flags.
				</dd>
			</div>
		</dl>
	</section>
</main>
