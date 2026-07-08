<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'caprini-venous-thromboembolism-risk-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Caprini Venous Thromboembolism Risk Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Caprini VTE risk-stratification tool</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A venous thromboembolism (VTE) risk-stratification tool for surgical and medical inpatients,
			completed as a single continuous wizard. A checklist of weighted risk factors — worth 1, 2, 3,
			or 5 points each — plus the patient's age band sum to a total Caprini score. The shared engine
			maps the total to a risk band (very low 0-1, low 2, moderate 3-4, high &ge; 5) and recommends a
			prophylaxis strategy, downgrading any pharmacological recommendation to mechanical when the
			bleeding risk is high.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/caprini-venous-thromboembolism-risk-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Caprini checklist. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/caprini-venous-thromboembolism-risk-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Caprini score, risk band, and recommended
				prophylaxis, and filter by care setting and risk band.
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
					Capture the weighted Caprini risk factors and produce a graded report — total score, risk
					band, recommended prophylaxis, and flagged issues — to support VTE-prevention decisions.
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
					Drawn from Caprini (Disease-a-Month 2005), the ACCP guidelines (Gould et al., Chest 2012),
					and NICE NG89. A risk-stratification aid, not a diagnostic test for VTE.
				</dd>
			</div>
		</dl>
	</section>
</main>
