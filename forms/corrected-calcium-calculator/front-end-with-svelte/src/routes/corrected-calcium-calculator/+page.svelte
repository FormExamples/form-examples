<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the calculator form and the clinician
	// dashboard.
	const plural = 'corrected-calcium-calculators';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Corrected Calcium Calculator
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Albumin-adjusted calcium for adults</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Enter a measured total calcium and serum albumin in a single continuous wizard, and the shared
			engine applies the standard albumin correction and classifies the result against the adult
			reference range.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/corrected-calcium-calculator/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new calculation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step calculator. One continuous single-page wizard that corrects and
				classifies the calcium as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/corrected-calcium-calculator/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed corrected calcium and classification, and
				filter by care setting and classification.
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
					Correct a total-calcium result for serum albumin — corrected calcium = total calcium +
					0.02 × (40 − albumin) — and produce a graded report against the adult reference range
					(2.20-2.60 mmol/L: hypocalcaemia below, hypercalcaemia above), with severe results
					(&ge; 3.0 or &lt; 1.9 mmol/L) flagged for urgent action, to support interpretation when
					albumin is abnormal.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the correction formula, and
					the classification and flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Payne albumin-correction formula (Payne et al., BMJ 1973), ACB adjusted-calcium
					guidance, and NICE CKS on hypercalcaemia and hypocalcaemia. An estimate, not a substitute
					for a measured ionised calcium.
				</dd>
			</div>
		</dl>
	</section>
</main>
