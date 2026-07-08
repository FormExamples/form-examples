<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/bone-marrow-donation-assessments` and
	// `/bone-marrow-donation-assessments/new`) hold the actual functionality.
	const plural = 'bone-marrow-donation-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Bone Marrow Donation Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Haematopoietic stem cell donor evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive donor work-up completed as a single continuous wizard: demographics, donor
			registration and HLA typing, medical history, physical examination, haematology, infectious
			disease screening, anaesthetic fitness, collection-method planning, psychological readiness, and
			consent. The shared engine classifies the donor's eligibility (suitable, conditionally
			suitable, or unsuitable), derives an overall risk level, and flags issues for the transplant
			team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/bone-marrow-donation-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step donor assessment. One continuous single-page wizard that classifies the
				donor as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/bone-marrow-donation-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed donors with their computed eligibility, overall risk level, HLA match, and
				collection method, and filter by eligibility and risk.
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
					Capture a structured donor profile and produce a graded report — eligibility, overall risk,
					HLA match level, collection method, and flagged issues — to support transplant review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the donor eligibility grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses a Donor Eligibility Classification with HLA match grading and an ASA-informed
					anaesthetic risk assessment.
				</dd>
			</div>
		</dl>
	</section>
</main>
