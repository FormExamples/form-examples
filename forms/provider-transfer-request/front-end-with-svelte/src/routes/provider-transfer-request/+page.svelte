<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the transfer form and the clinician
	// dashboard. The collection routes (`/provider-transfer-requests` and
	// `/provider-transfer-requests/new`) hold the actual functionality.
	const plural = 'provider-transfer-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Provider Transfer Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Inter-provider handover (SBAR)</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured, nine-section handover for a patient whose care is being transferred between
			clinicians, wards, or organisations, built around the SBAR (Situation, Background, Assessment,
			Recommendation) framework, whose shared engine validates SBAR completeness — Complete, Partial,
			or Incomplete — and flags clinically significant issues for the receiving team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/provider-transfer-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new transfer request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step handover form. One continuous single-page wizard that validates
				completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/provider-transfer-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse transfer requests with their computed completeness, urgency, mandatory-field counts,
				and safety flag totals, and filter by completeness and urgency.
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
					Capture a complete, SBAR-aligned handover — requesting/receiving provider details, patient
					demographics, the four SBAR sections, transfer logistics, and a two-party sign-off and
					acknowledgement — and produce a graded report — completeness level, per-section breakdown
					of missing items, and flagged safety issues — to support a safe inter-provider transfer.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness validation
					rules, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the SBAR (Situation, Background, Assessment, Recommendation) communication framework,
					with NEWS2-aware vital-sign flagging and two-party sign-off gating.
				</dd>
			</div>
		</dl>
	</section>
</main>
