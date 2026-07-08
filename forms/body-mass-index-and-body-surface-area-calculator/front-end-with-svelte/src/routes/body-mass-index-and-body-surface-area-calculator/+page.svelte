<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the calculator form and the clinician
	// dashboard.
	const plural = 'body-mass-index-and-body-surface-area-calculators';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Body Mass Index and Body Surface Area Calculator
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">BMI and BSA from height and weight</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Enter a measured height (cm) and weight (kg) in a single continuous wizard. The shared engine
			computes the Body Mass Index — BMI = weight ÷ height² — and bands it into the WHO adult
			weight-status categories: underweight (&lt; 18.5), normal (18.5-24.9), overweight (25.0-29.9),
			and obese class I-III (&ge; 30). It also computes the Body Surface Area by the Mosteller and Du
			Bois formulae. Severe obesity (&ge; 40) and underweight (&lt; 18.5) are flagged, and Asian
			action points at &ge; 23 and &ge; 27.5 are recorded when ancestry is Asian.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/body-mass-index-and-body-surface-area-calculator/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new calculation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step calculator. One continuous single-page wizard that computes the BMI,
				WHO category, and BSA as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/body-mass-index-and-body-surface-area-calculator/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed BMI, WHO category, and body surface area, and
				filter by care setting and category.
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
					Convert a patient's height and weight into a BMI with the WHO weight-status category and a
					body surface area in m² to support screening, monitoring, and drug dosing.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the BMI and BSA formulae, and
					the WHO banding and flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from WHO TRS 894, the WHO Expert Consultation on Asian BMI thresholds (Lancet 2004),
					the Mosteller (NEJM 1987) and Du Bois (1916) BSA formulae, and NICE CG189. An aid to
					interpretation, not a substitute for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
