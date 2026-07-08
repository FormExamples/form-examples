<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the casualty card form and the
	// clinician dashboard. The collection routes (`/casualty-cards` and
	// `/casualty-cards/new`) hold the actual functionality.
	const plural = 'casualty-cards';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Casualty Card</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Emergency department casualty card</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A complete Emergency Department / Minor Injury Unit casualty card captured as a single
			continuous wizard: demographics, next of kin and GP, arrival and triage, presenting complaint,
			pain assessment, medical history, vital signs, ABCDE primary survey, clinical examination,
			investigations, treatment, assessment and plan, disposition, and safeguarding and consent. The
			shared engine auto-calculates the NEWS2 (National Early Warning Score 2) clinical response and
			flags safety-critical issues for clinical review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/casualty-card-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new casualty card</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step casualty card. One continuous single-page wizard that computes the
				NEWS2 score and clinical response as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/casualty-card-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse attendances with their computed NEWS2 score and clinical response, and filter by
				clinical response and triage category.
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
					Capture a structured ED record from arrival through triage, assessment, treatment, and
					disposition, and produce a graded report — NEWS2 score, clinical response, and flagged
					safety issues — to support emergency review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the NEWS2 scoring engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Royal College of Physicians NEWS2 early-warning score and the Manchester Triage
					System (MTS) categories.
				</dd>
			</div>
		</dl>
	</section>
</main>
