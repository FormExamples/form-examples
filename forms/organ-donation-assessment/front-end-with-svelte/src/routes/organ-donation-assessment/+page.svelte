<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/organ-donation-assessments` and
	// `/organ-donation-assessments/new`) hold the actual functionality.
	const plural = 'organ-donation-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Organ Donation Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Donor suitability evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive organ-donor evaluation — covering demographics, donor type and
			registration, medical history, organ function, infectious-disease screening, immunological
			compatibility, surgical assessment, and, for living donors, psychological and ethical /
			legal requirements — whose shared engine classifies the donor with the Donor Risk Index and
			organ-specific suitability scoring, deriving an eligibility decision (suitable,
			conditionally suitable, unsuitable), an overall risk level, and flagged issues for the donor
			assessment team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/organ-donation-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that classifies the
				donor as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/organ-donation-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed donors with their computed eligibility and overall risk level, and filter by
				eligibility and risk.
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
					fired donor rules, and flagged issues — to support the donor assessment team's decision.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the eligibility / risk grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Donor Risk Index and organ-specific suitability scoring, with UK Human Tissue Act
					2004 (HTA) requirements for living-donor consent and independent-assessor review.
				</dd>
			</div>
		</dl>
	</section>
</main>
