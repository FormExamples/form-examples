<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'apgar-scores';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Apgar Score</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Newborn Apgar scoring</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A rapid assessment of a newborn's condition in the first minutes after birth, completed as a
			single continuous wizard. Five signs — Appearance (skin colour), Pulse (heart rate), Grimace
			(reflex irritability), Activity (muscle tone), and Respiration — are each scored 0, 1, or 2 and
			summed to a total of 0 to 10 at each timepoint (1 minute, 5 minutes, and 10 minutes and beyond
			whenever the 5-minute total is below 7). The shared engine derives each total's band (7-10
			reassuring, 4-6 moderately low, 0-3 low), the trend across timepoints, and any safety flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/apgar-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Apgar wizard. One continuous single-page form that scores each
				timepoint as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/apgar-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed newborns with their computed totals, band, and trend, and filter by care
				setting and band.
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
					Capture the five Apgar signs at each timepoint and produce a graded report — per-timepoint
					total, band, trend, and flagged issues — to support timely newborn resuscitation and
					escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive per-timepoint
					scoring engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Apgar V. (Curr Res Anesth Analg, 1953), the AAP & ACOG committee opinion on the
					Apgar score, Resuscitation Council UK Newborn Life Support, and NICE NG235. A clinical
					assessment, not a prognosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
