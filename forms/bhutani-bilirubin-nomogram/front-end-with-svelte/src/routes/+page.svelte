<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'bhutani-bilirubin-nomograms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Bhutani Bilirubin Nomogram
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Hour-specific bilirubin risk zone for newborns
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Enter a newborn's age in hours and total serum bilirubin (µmol/L) in a single continuous
			wizard. The shared engine maps the point onto the hour-specific Bhutani nomogram to assign a
			percentile risk zone — low (&lt; 40th), low-intermediate (40th&ndash;75th), high-intermediate
			(75th&ndash;95th), or high (&ge; 95th) — and compares the same point against the
			gestation-specific NICE phototherapy and exchange-transfusion thresholds. This is a
			classification, not an additive score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment. One continuous single-page wizard that classifies the risk
				zone and treatment-threshold signals as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed infants with their computed risk zone and treatment-threshold signals, and
				filter by care setting and risk zone.
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
					Predict the risk of subsequent significant hyperbilirubinaemia and signal whether the TSB
					is at or above the gestation-specific phototherapy or exchange-transfusion thresholds, to
					support timely re-testing and treatment decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the two independent lookups
					(zone prediction and treatment thresholds), and the flag rules. The same engine grades
					both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Bhutani hour-specific nomogram (Bhutani et al., Pediatrics 1999) and the
					NICE CG98 gestation-specific treatment-threshold graphs. This tool is for information only
					and is not a diagnosis; interpret alongside clinical judgement and local policy.
				</dd>
			</div>
		</dl>
	</section>
</main>
