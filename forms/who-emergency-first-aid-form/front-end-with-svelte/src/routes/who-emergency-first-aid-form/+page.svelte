<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the encounter form and the clinician
	// dashboard. The collection routes (`/who-emergency-first-aid-forms` and
	// `/who-emergency-first-aid-forms/new`) hold the actual functionality.
	const plural = 'who-emergency-first-aid-forms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			WHO Emergency First Aid Form
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Community first aid documentation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The World Health Organization standardised emergency first aid documentation form, completed as
			a single continuous wizard following the systematic CABCDE (major bleeding, Airway, Breathing,
			Circulation, Disability, Exposure) assessment framework, whose shared engine checks completeness
			and flags clinically significant issues for the receiving facility.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/who-emergency-first-aid-form/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new encounter</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that checks completeness and
				flags issues as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/who-emergency-first-aid-form/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded encounters with their completeness status and flag counts, and filter by
				problem type and completeness.
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
					Capture a structured emergency first aid record — patient identification, referral and
					transport, situation, background, the systematic CABCDE assessment and interventions,
					recommendations and precautions, and community first aid responder details — and produce
					a handover report — completeness status, outstanding fields, and flagged issues — for the
					receiving facility.
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
					Based on the World Health Organization Emergency First Aid Form for Community First Aid
					Responders (CFAR), using the CABCDE systematic assessment approach.
				</dd>
			</div>
		</dl>
	</section>
</main>
