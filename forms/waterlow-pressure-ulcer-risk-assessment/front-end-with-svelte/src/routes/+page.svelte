<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'waterlow-pressure-ulcer-risk-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Waterlow Pressure Ulcer Risk Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Waterlow pressure-ulcer risk screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside pressure-ulcer risk screen for adults, completed as a single continuous wizard. It
			records weighted risk categories — build / weight for height, skin type, sex and age,
			continence, and mobility — plus four special-risk groups, and <strong>sums</strong> the points
			into a Waterlow total. A higher total means higher risk. The shared engine maps the total to a
			risk band (low under 10, at risk 10-14, high 15-19, very high &ge; 20) and recommends how far
			to escalate the pressure-relieving support surface, repositioning, and skin care.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Waterlow screen. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Waterlow score and risk band, and filter by
				care setting and risk band.
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
					Capture the weighted Waterlow risk categories and produce a graded report — total score,
					risk band, recommended prevention, and flagged issues — to support pressure-ulcer
					prevention decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the summed weighted scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Waterlow (Nursing Times 1985; revised 2005), NICE CG179 / QS89, and the EPUAP /
					NPIAP / PPPIA guideline (2019). A risk-screening aid, not a diagnosis or staging of
					existing pressure damage.
				</dd>
			</div>
		</dl>
	</section>
</main>
