<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/framingham-risk-scores-for-hard-coronary-heart-disease`
	// and `/framingham-risk-scores-for-hard-coronary-heart-disease/new`) hold the
	// actual functionality.
	const plural = 'framingham-risk-scores-for-hard-coronary-heart-disease';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Framingham Risk Score for Hard Coronary Heart Disease
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Cardiovascular risk calculator</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Estimates the 10-year risk of hard coronary heart disease events (myocardial infarction or
			coronary death) in patients aged 30–79 with no history of coronary heart disease or diabetes,
			completed as a single continuous wizard: patient information, demographics, smoking history,
			blood pressure, cholesterol, medical history, family history, lifestyle factors, current
			medications, and review. The shared engine applies the Wilson / D'Agostino 1998 (ATP III)
			Framingham Cox-regression model, categorises the risk as low, intermediate, or high, and flags
			actionable issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/framingham-risk-score-for-hard-coronary-heart-disease/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that computes the
				10-year risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/framingham-risk-score-for-hard-coronary-heart-disease/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed 10-year risk percentage and risk category, and
				filter by risk category and smoking status.
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
					Capture a structured cardiovascular risk profile and produce a graded report — the 10-year
					hard CHD risk percentage, the risk category, and flagged issues — to support clinical
					decision making.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Framingham Cox-regression
					grading engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Framingham Heart Study 'Hard' CHD outcomes model (Wilson / D'Agostino 1998, ATP
					III). Categories: low (&lt; 10 %), intermediate (10 – &lt; 20 %), high (≥ 20 %).
				</dd>
			</div>
		</dl>
	</section>
</main>
