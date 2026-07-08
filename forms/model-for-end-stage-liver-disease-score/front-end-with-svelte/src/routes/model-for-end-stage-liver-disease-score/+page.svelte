<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the calculator form and the clinician
	// dashboard.
	const plural = 'model-for-end-stage-liver-disease-scores';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Model for End-Stage Liver Disease (MELD) Score
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Liver disease severity for adults</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Enter total bilirubin, INR, and serum creatinine — plus serum sodium (MELD-Na, MELD 3.0) and
			albumin (MELD 3.0) — in a single continuous wizard. The shared engine applies the weighted
			logarithmic formula with the dialysis creatinine rule (creatinine set to 4.0 mg/dL when there
			were &ge; 2 haemodialysis sessions or &ge; 24 h CVVHD), value bounds (floor 1.0; creatinine
			cap 4.0), the sodium correction, clamps the result to 6-40, and maps it to an estimated
			3-month mortality band: low (&le; 9), moderate (10-19), high (20-29), very high (30-39),
			extreme (&ge; 40).
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/model-for-end-stage-liver-disease-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new calculation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step calculator. One continuous single-page wizard that computes the MELD
				score and mortality band as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/model-for-end-stage-liver-disease-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed MELD score and mortality band, and filter by
				care setting and band.
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
					Grade the severity of chronic liver disease from routine laboratory values and produce a
					report — MELD score, mortality band, and flagged issues — to support transplant
					prioritisation. A decision-support calculator, not a diagnosis.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the weighted logarithmic
					formula, the dialysis rule, and the classification and flag rules. The same engine grades
					both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Kamath et al. (2001), the UNOS MELD-Na policy, and Kim et al. (2021) for MELD
					3.0. An estimate, not a substitute for specialist hepatology assessment.
				</dd>
			</div>
		</dl>
	</section>
</main>
