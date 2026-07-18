<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'qrisk3-cardiovascular-disease-risk-scores';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			QRISK3 Cardiovascular Disease Risk Score
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">10-year cardiovascular risk calculator</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A primary-prevention CVD risk assessment for UK primary care, completed as a single continuous
			wizard, that applies a sex-specific weighted risk model to demographic, lifestyle, comorbidity,
			and measurement inputs and returns a <strong>10-year CVD risk percentage</strong>, a risk band,
			and an estimated heart age.
		</p>
		<p
			class="mt-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-base-content/80"
		>
			<strong>Representative model.</strong> The scoring engine is a documented approximation in the
			shape of QRISK3, not the official QRISK3-2017 algorithm. It ranks patients the way QRISK3 would
			but must not be used for real clinical decision-making.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/qrisk3-cardiovascular-disease-risk-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step QRISK3 calculator. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/qrisk3-cardiovascular-disease-risk-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed 10-year risk and risk band, and filter by care
				setting and risk band.
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
					Capture the QRISK3 inputs — demographic, lifestyle, comorbidity, and measurement — and
					produce a graded report — 10-year risk %, risk band, heart age, and flagged issues — to
					support the NICE statin-offer decision: a result &ge; 10% meets the threshold at which a
					statin plus lifestyle advice should be offered.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the weighted risk engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from QRISK3 (Hippisley-Cox et al., BMJ 2017) and NICE NG238. A representative model,
					not clinically authoritative.
				</dd>
			</div>
		</dl>
	</section>
</main>
