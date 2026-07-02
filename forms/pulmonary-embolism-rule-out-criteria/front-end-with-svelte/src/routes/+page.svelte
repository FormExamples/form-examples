<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'pulmonary-embolism-rule-out-criterias';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Pulmonary Embolism Rule-out Criteria
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">PERC bedside rule-out screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside rule-out screen for adults in whom the clinician has already judged the pre-test
			probability of pulmonary embolism to be <strong>low</strong>, completed as a single
			continuous wizard. It records eight objective criteria — age under 50, heart rate under 100,
			SpO2 at least 95%, no unilateral leg swelling, no haemoptysis, no recent surgery or trauma, no
			prior venous thromboembolism, and no exogenous oestrogen — plus the gestalt pre-test
			probability. When the pre-test probability is <strong>low</strong> and
			<strong>all eight criteria are satisfied</strong>, the result is
			<strong>PERC-negative</strong> and PE is excluded without a D-dimer or imaging; otherwise it
			is <strong>PERC-positive</strong>. This is a status / classification form: there is no numeric
			score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step PERC screen. One continuous single-page wizard that classifies the
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
				Browse assessed patients with their computed PERC classification and failed criteria, and
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
					Capture the eight PERC criteria and the pre-test probability, and produce a graded report
					— a PERC-negative / PERC-positive classification, the failed-criteria set, and flagged
					issues — to safely reduce unnecessary D-dimer testing and imaging in low-risk patients.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the boolean classification
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Kline et al. (J Thromb Haemost 2004; validation 2008), the PROPER trial (JAMA
					2018), and NICE NG158. A rule-out prompt, not a diagnosis; a PERC-positive result only
					means PE cannot be ruled out by PERC alone.
				</dd>
			</div>
		</dl>
	</section>
</main>
