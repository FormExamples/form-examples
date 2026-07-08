<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/heart-health-checks` and
	// `/heart-health-checks/new`) hold the actual functionality.
	const plural = 'heart-health-checks';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Heart Health Check</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Cardiovascular risk assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			An NHS Heart Health Check completed as a single continuous wizard: patient information,
			demographics and ethnicity, blood pressure, cholesterol, medical conditions, family history,
			smoking and alcohol, physical activity and diet, body measurements, and clinician review. The
			shared engine estimates the 10-year cardiovascular disease risk using a simplified QRISK3-based
			model, derives the patient's heart age, classifies the overall risk, and flags issues for the
			clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/heart-health-check/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new check</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that estimates the
				10-year CVD risk and heart age when you submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/heart-health-check/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed 10-year risk, heart age, and risk category, and
				filter by risk category and sex.
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
					Capture a structured cardiovascular profile and produce a graded report — 10-year CVD
					risk, heart age, risk category, fired risk rules, and flagged issues — to support
					clinician review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the simplified QRISK3-based
					scoring engine, the 20 HHC risk rules, and the 13 clinical flag rules. The same engine
					grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses a simplified QRISK3-based 10-year cardiovascular risk estimate with heart-age
					calculation; categories are Low (&lt;10%), Moderate (10–19.9%), and High (≥20%).
				</dd>
			</div>
		</dl>
	</section>
</main>
