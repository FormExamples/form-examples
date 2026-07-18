<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'modified-early-warning-scores';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Modified Early Warning Score
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			MEWS bedside track-and-trigger early warning score
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside aggregate track-and-trigger score for adult inpatients (Subbe et al., QJM 2001),
			completed as a single continuous wizard, that flags an aggregate of 5 or more, or any single
			parameter scoring 3, as a trigger for urgent medical review and critical-care outreach.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/modified-early-warning-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step MEWS observation set. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/modified-early-warning-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their aggregate MEWS, risk band, single-parameter-trigger flag,
				and recommended monitoring frequency.
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
					Capture the five MEWS parameters — systolic blood pressure, heart rate, respiratory rate,
					temperature, and AVPU level of consciousness, each allocated a sub-score of 0 to 3 — and
					produce a graded report — aggregate MEWS (0-14), risk band, monitoring frequency, and
					flagged issues — to support timely clinical escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Subbe (2001) allocation
					table, the aggregate scoring engine, the single-parameter=3 trigger, and the flag rules.
					The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Subbe et al. (QJM 2001) and NICE CG50. A decision-support aid, not a diagnosis.
					MEWS predates and is superseded by NEWS2 in the UK.
				</dd>
			</div>
		</dl>
	</section>
</main>
