<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'cha2ds2-vasc-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			CHA2DS2-VASc stroke-risk score for atrial fibrillation
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinical prediction tool for adults with non-valvular atrial fibrillation, completed as a
			single continuous wizard. Eight weighted criteria — congestive heart failure, hypertension,
			age &ge; 75 (2) or 65&ndash;74 (1), diabetes, prior stroke / TIA / thromboembolism (2),
			vascular disease, and female sex category — sum to a total of 0 to 9. The shared engine derives
			the risk band, the estimated annual stroke rate, and an anticoagulation recommendation, and
			pairs with HAS-BLED for the bleeding-risk side of the treatment decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step CHA2DS2-VASc score. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed CHA2DS2-VASc score and risk band, and filter by
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
					Capture the eight CHA2DS2-VASc criteria and produce a graded report — score 0&ndash;9, risk
					band, estimated annual stroke rate, and flagged issues — to guide the anticoagulation
					decision.
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
					Drawn from Lip et al. (Chest 2010), the 2020 ESC AF guidelines, and NICE NG196. A
					decision-support tool, not a diagnostic test.
				</dd>
			</div>
		</dl>
	</section>
</main>
