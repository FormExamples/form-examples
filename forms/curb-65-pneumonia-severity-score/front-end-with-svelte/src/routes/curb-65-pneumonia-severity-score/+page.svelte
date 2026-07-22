<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'curb-65-pneumonia-severity-scores';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/curb-65-pneumonia-severity-score/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step CURB-65 assessment. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/curb-65-pneumonia-severity-score/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed severity score and risk band, and filter by
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
					Capture the five CURB-65 criteria — new-onset Confusion, Urea &gt; 7 mmol/L, Respiratory
					rate &ge; 30/min, low Blood pressure (systolic &lt; 90 or diastolic &le; 60), and age
					&ge; 65, each worth 1 point — and produce a graded report — score 0-5, mortality-risk
					band, recommended disposition, and flagged issues — to support the site-of-care decision.
					Where serum urea is unavailable, the four-criterion CRB-65 primary-care variant (0-4) is
					computed instead.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine
					(with the CRB-65 fallback), and the flag rules. The same engine grades both the form and
					the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the British Thoracic Society CAP guidance and the CURB-65 derivation (Lim et
					al., Thorax 2003). A severity aid, not a substitute for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
