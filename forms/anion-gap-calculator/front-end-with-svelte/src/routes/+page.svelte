<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the calculator form and the clinician
	// dashboard.
	const plural = 'anion-gap-calculators';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Anion Gap Calculator</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Serum anion gap and albumin correction for adults
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Enter a routine serum electrolyte panel (sodium, chloride, bicarbonate; optional potassium and
			albumin) in a single continuous wizard. The shared engine computes the anion gap — (Na + K) −
			(Cl + HCO₃), or Na − (Cl + HCO₃) without potassium — corrects it for albumin (+ 0.25 × (40 −
			albumin)), and classifies the result: normal, low (&lt; 8 mmol/L), high (above the upper
			bound), or very high (&ge; 20 mmol/L). A high gap is flagged for a HAGMA differential.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new calculation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step calculator. One continuous single-page wizard that computes and
				classifies the anion gap as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed anion gap and classification, and filter by
				care setting and classification.
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
					Turn a routine electrolyte panel into a computed anion gap, an albumin-corrected gap, a
					classification band, and flagged issues that direct further investigation. It is a
					decision-support prompt, not a diagnosis.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the anion-gap formula and
					albumin correction, and the classification and flag rules. The same engine grades both the
					form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Kraut &amp; Madias (CJASN 2007) and Figge et al. (Crit Care Med 1998). A high
					gap should trigger a structured search for the cause (GOLDMARK / MUDPILES). A normal gap
					does not exclude a normal-gap (hyperchloraemic) acidosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
