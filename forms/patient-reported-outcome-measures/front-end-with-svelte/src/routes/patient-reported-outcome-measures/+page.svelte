<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the visit wizard and the clinician
	// dashboard.
	const plural = 'patient-reported-outcome-measure-visits';
</script>

<main class="mx-16 px-4 py-12">
	<h1 class="text-2xl font-bold text-base-content">Patient-Reported Outcome Measures</h1>
	<p class="mt-2 max-w-2xl text-base-content/70">
		A battery of four independent, validated patient-reported outcome instruments — SF-36v2,
		Neck Disability Index (NDI), modified JOA (mJOA), and EQ-5D-3L — commonly administered
		together in spine-surgery outcomes research.
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<a
			href="/patient-reported-outcome-measures/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new visit</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step battery. One continuous single-page wizard covering the visit
				header and all four instruments, scored as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/patient-reported-outcome-measures/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded visits with their computed SF-36 summaries, NDI band, mJOA band, and
				EQ-5D index.
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
					Capture the four PRO instruments for one patient at one visit/time point and produce
					each instrument's own computed score — there is no cross-instrument composite.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines every item, response scale, and the exact
					scoring algorithm for each instrument (public-domain RAND-36 SF-36 domain scoring, the
					standard NDI and mJOA methods, and the Dolan 1997 UK TTO EQ-5D-3L tariff). The same
					engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Transcribed from a cervical-spine surgery outcomes appendix. SF-36 domain scoring
					reports simplified, non-licensed <code>pcsApprox</code>/<code>mcsApprox</code>
					approximations — not the trademarked QualityMetric norm-based SF-36v2 PCS/MCS.
				</dd>
			</div>
		</dl>
	</section>
</main>
