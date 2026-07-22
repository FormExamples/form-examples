<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'paediatric-early-warning-scores';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/paediatric-early-warning-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step PEWS observation set. One continuous single-page wizard that scores
				the child as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/paediatric-early-warning-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed children with their aggregate PEWS total, escalation band, single-parameter
				trigger, and recommended monitoring frequency.
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
					Capture the seven PEWS parameters &mdash; respiratory rate, effort, SpO2, and oxygen; heart
					rate and capillary refill; and ACVPU consciousness &mdash; against the child's age band and
					produce a graded report &mdash; aggregate total, escalation band, monitoring frequency, and
					flagged issues &mdash; to support timely clinical escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the age-banded additive scoring
					engine (the age band sets the rate-parameter normal ranges), the single-parameter and
					concern override triggers, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the NHS England &amp; RCPCH National Paediatric Early Warning System (PEWS)
					chart and NICE NG51. A decision-support aid, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
