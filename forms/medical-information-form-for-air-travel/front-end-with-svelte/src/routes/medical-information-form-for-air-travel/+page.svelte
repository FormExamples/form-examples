<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the MEDIF form and the airline
	// medical-desk dashboard. The collection routes hold the functionality.
	const plural = 'medical-information-forms-for-air-travel';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Medical Information Form for Air Travel
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Fitness-to-fly assessment (MEDIF)</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Digitisation of the airline Medical Information Form (MEDIF), completed as a single continuous
			14-section wizard: submitting agent, passenger identity, trip details, the reason clearance is
			required, the attending physician's evaluation, diagnosis, cardiovascular and respiratory
			status, recent events and surgery, pregnancy, communicable disease, requested in-flight
			accommodations, cabin medications and equipment, and physician sign-off. The shared engine
			grades a fitness-to-fly band, fires airline-aligned rules, and emits clinical safety flags for
			the airline medical desk.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/medical-information-form-for-air-travel/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new MEDIF</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that computes the
				fitness-to-fly band as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/medical-information-form-for-air-travel/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Medical-desk dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted MEDIFs with their computed fitness band and safety-flag count, and filter by
				band and airline.
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
					Capture a structured fitness-to-fly profile and produce a graded report — fitness band,
					fired rules, safety flags, and a medical-desk recommendation — to support airline clearance.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the max-grade fitness engine,
					and the airline-aligned rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned to the IATA Medical Manual, IATA Dangerous Goods Regulations, and the Aerospace
					Medical Association guidelines for airline travel.
				</dd>
			</div>
		</dl>
	</section>
</main>
