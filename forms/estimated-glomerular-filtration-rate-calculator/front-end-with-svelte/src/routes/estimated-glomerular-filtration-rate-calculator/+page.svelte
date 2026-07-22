<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the calculator form and the clinician
	// dashboard.
	const plural = 'estimated-glomerular-filtration-rate-calculators';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/estimated-glomerular-filtration-rate-calculator/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new calculation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step calculator. One continuous single-page wizard that estimates the GFR
				and CKD G-stage as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/estimated-glomerular-filtration-rate-calculator/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed eGFR and CKD G-stage, and filter by care
				setting and stage.
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
					Estimate the glomerular filtration rate from a single serum creatinine (µmol/L), age, and
					sex, using the CKD-EPI 2021 creatinine equation (race-free), and produce a graded report —
					eGFR and a KDIGO CKD G-stage banded as G1 (&ge; 90), G2 (60–89), G3a (45–59), G3b (30–44),
					G4 (15–29), or G5 (&lt; 15), plus flagged issues — to support monitoring, medication-dose
					review, and referral decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the CKD-EPI 2021 creatinine
					equation, and the G-stage banding and flag rules. The same engine grades both the form and
					the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the CKD-EPI 2021 creatinine equation (Inker et al., NEJM 2021), KDIGO 2012 CKD
					classification, and NICE NG203. An estimate, not a measured GFR, and unreliable when renal
					function is not at steady state.
				</dd>
			</div>
		</dl>
	</section>
</main>
