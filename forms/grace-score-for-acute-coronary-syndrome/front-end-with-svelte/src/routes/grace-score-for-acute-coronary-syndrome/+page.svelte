<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'grace-scores-for-acute-coronary-syndrome';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/grace-score-for-acute-coronary-syndrome/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step GRACE score. One continuous single-page wizard that scores the patient
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/grace-score-for-acute-coronary-syndrome/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed GRACE points and risk category, and filter by
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
					Capture the eight GRACE variables — age, heart rate, systolic blood pressure, serum
					creatinine, Killip class, cardiac arrest at admission, ST-segment deviation, and elevated
					cardiac enzymes — and produce a graded report: point total, in-hospital (&le; 108 /
					109&ndash;140 / &gt; 140) and 6-month (&le; 88 / 89&ndash;118 / &gt; 118) mortality bands, the
					overall risk category (the worse of the two), an invasive-strategy recommendation, and flagged
					issues, to support timely risk-based management of acute coronary syndrome.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the weighted regression point
					model, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the GRACE derivation and validation studies (Granger et al., Arch Intern Med
					2003; Fox et al., BMJ 2006 and BMJ Open 2014), the ESC ACS guidelines (2023), and NICE
					NG185. A decision-support prompt, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
