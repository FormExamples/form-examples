<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'pulmonary-embolism-rule-out-criterias';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/pulmonary-embolism-rule-out-criteria/{plural}/new"
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
			href="/pulmonary-embolism-rule-out-criteria/{plural}"
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
					Capture the eight PERC criteria — age under 50, heart rate under 100, SpO2 at least 95%, no
					unilateral leg swelling, no haemoptysis, no recent surgery or trauma, no prior venous
					thromboembolism, and no exogenous oestrogen — and the pre-test probability, and produce a
					graded report — a PERC-negative / PERC-positive classification, the failed-criteria set,
					and flagged issues — to safely reduce unnecessary D-dimer testing and imaging in low-risk
					patients.
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
