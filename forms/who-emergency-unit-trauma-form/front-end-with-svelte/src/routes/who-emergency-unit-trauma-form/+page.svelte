<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the encounter form and the clinician
	// dashboard. The collection routes (`/who-emergency-unit-trauma-forms` and
	// `/who-emergency-unit-trauma-forms/new`) hold the actual functionality.
	const plural = 'who-emergency-unit-trauma-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			WHO Emergency Unit Trauma Form
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Emergency unit trauma documentation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The World Health Organization standardised emergency unit clinical documentation form for
			trauma patients, completed as a single continuous wizard around the ABCDE primary survey with
			FAST ultrasound, whose shared engine checks the record for completeness and flags clinically
			significant issues for the receiving team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/who-emergency-unit-trauma-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new encounter</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that checks completeness and
				flags issues when you submit it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/who-emergency-unit-trauma-form/{plural}"
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
					Capture a structured emergency unit trauma record — patient registration, chief complaint
					and vitals, high-risk red signs and trauma indicators, triage, the ABCDE primary survey
					with FAST ultrasound, injury history, past histories, physical exam, assessment and plan,
					diagnostics, medications and procedures, reassessment, and disposition — and produce a
					handover report — triage category, completeness status, outstanding fields, and flagged
					issues — for the receiving team.
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
					Based on the World Health Organization Emergency Unit Form: Trauma, using the ABCDE + FAST
					systematic assessment approach.
				</dd>
			</div>
		</dl>
	</section>
</main>
