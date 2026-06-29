<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the counter-referral form and the
	// clinician dashboard. The collection routes
	// (`/who-counter-referral-forms` and `/who-counter-referral-forms/new`) hold
	// the actual functionality.
	const plural = 'who-counter-referral-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			WHO Counter-Referral Form
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Discharge back to primary care</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The World Health Organization standardised counter-referral form, completed as a single
			continuous wizard following the SBAR communication framework: patient identification, facility
			details, Situation, Background, Assessment, Recommendations, and provider sign-off. The shared
			engine checks the form for completeness and flags clinically significant issues for the primary
			care provider receiving the patient.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new counter-referral</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that checks completeness and
				flags issues as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse counter-referred patients with their completeness status, follow-up timeframe, and
				review priority, and filter by follow-up timeframe and priority.
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
					Capture a structured counter-referral when a referral facility discharges a patient back to
					primary care, and produce a completeness summary plus flagged issues to support a safe
					handover.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the SBAR data model, the completeness rules, and
					the flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the WHO Counter-Referral Form, the return complement to the WHO Acute Referral Form
					(initiating → referral facility), using the SBAR framework for clinical handover.
				</dd>
			</div>
		</dl>
	</section>
</main>
