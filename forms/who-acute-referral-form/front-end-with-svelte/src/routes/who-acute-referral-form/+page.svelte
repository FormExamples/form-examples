<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the referral form and the clinician
	// dashboard. The collection routes (`/who-acute-referral-forms` and
	// `/who-acute-referral-forms/new`) hold the actual functionality.
	const plural = 'who-acute-referral-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">WHO Acute Referral Form</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Inter-facility patient transfer</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The World Health Organization standardised acute referral form, completed as a single
			continuous wizard following the SBAR (Situation, Background, Assessment, Recommendations)
			communication framework: patient identification, facility and transport details, situation,
			background with ABCDE assessment and interventions, clinical assessment with vital signs,
			transport recommendations and precautions, provider sign-off, and referral-facility receipt.
			The shared engine checks completeness and flags clinically significant issues for the
			receiving facility.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/who-acute-referral-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new referral</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step referral form. One continuous single-page wizard that checks
				completeness and flags clinical issues as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/who-acute-referral-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse referrals with their completeness status, transport mode, and flagged-issue counts,
				and filter by completeness and mode of transfer.
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
					Capture a structured acute referral for an inter-facility patient transfer and produce a
					report — completeness summary plus flagged clinical issues — that travels with the patient
					to the receiving facility.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness validation
					rules, and the flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Follows the WHO acute referral form and the SBAR / ABCDE clinical communication frameworks.
				</dd>
			</div>
		</dl>
	</section>
</main>
