<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'timi-risk-score-for-acute-coronary-syndromes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			TIMI Risk Score for Acute Coronary Syndrome
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			TIMI UA/NSTEMI bedside risk-stratification score
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside risk-stratification tool, completed as a single continuous wizard, that scores adults
			presenting with unstable angina or NSTEMI on seven clinical criteria — age &ge; 65, &ge; 3
			coronary risk factors, known CAD, aspirin in the prior 7 days, &ge; 2 anginal episodes in 24 h,
			ST deviation &ge; 0.5 mm, and a positive cardiac marker — from which the shared engine sums a
			0-to-7 total, derives the risk band, and maps it to the 14-day risk of death, MI, or urgent
			revascularisation.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/timi-risk-score-for-acute-coronary-syndrome/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step TIMI score. One continuous single-page wizard that scores the patient
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/timi-risk-score-for-acute-coronary-syndrome/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed TIMI score, risk band, and 14-day risk, and
				filter by care setting and risk band.
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
					Capture the seven TIMI criteria (age, risk-factor burden, known CAD, aspirin use, anginal
					frequency, ST deviation, and cardiac markers) and produce a graded report — score 0-7, risk
					band (0-1 low, 2-4 intermediate, 5-7 high), mapped 14-day event risk, and flagged issues —
					to support the choice of an early invasive versus conservative strategy. This is the
					UA/NSTEMI version of the TIMI score; do not use it for STEMI.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Derived by Antman et al. (JAMA 2000) from the TIMI 11B and ESSENCE cohorts; see NICE NG185
					and the 2020 ESC ACS guidelines. A decision-support tool, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
