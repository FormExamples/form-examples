<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'national-early-warning-score-2s';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			National Early Warning Score 2
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			NEWS2 track-and-trigger early warning score
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned implementation of the Royal College of Physicians' (2017) standardised
			track-and-trigger early warning system, completed as a single continuous wizard. A clinician
			records six physiological parameters — respiration rate, oxygen saturation, air or oxygen,
			systolic blood pressure, pulse, consciousness (ACVPU), and temperature — each scored 0 to 3.
			The shared engine adds a supplemental-oxygen weighting, aggregates the total, applies the
			red-score rule, and returns the clinical-risk band with the RCP-recommended monitoring
			frequency and escalation response.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/national-early-warning-score-2/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step NEWS2 observation set. One continuous single-page wizard that scores
				the patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/national-early-warning-score-2/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their aggregate NEWS2 total, risk band, red-score flag, and
				recommended monitoring frequency.
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
					Capture the six NEWS2 parameters and produce a graded report — aggregate total, risk band,
					monitoring frequency, and flagged issues — to support timely clinical escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine
					(including the Scale 1 / Scale 2 SpO2 logic and the red-score escalation), and the flag
					rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Royal College of Physicians' NEWS2 report (2017). A decision-support aid,
					not a diagnosis; NEWS2 is not validated for patients under 16, pregnancy, or spinal-cord
					injury.
				</dd>
			</div>
		</dl>
	</section>
</main>
