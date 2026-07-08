<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/hormone-replacement-therapy-assessments`
	// and `/hormone-replacement-therapy-assessments/new`) hold the functionality.
	const plural = 'hormone-replacement-therapy-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Hormone Replacement Therapy Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Menopause symptom & HRT eligibility</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive menopause and HRT eligibility evaluation completed as a single continuous
			wizard: demographics, menopause status, the Menopause Rating Scale (MRS) symptom inventory,
			vasomotor symptoms, bone health, cardiovascular risk, breast health, current medications, a
			contraindications screen, and treatment preferences. The shared engine computes the MRS total
			and subscale scores with a severity band, classifies the HRT risk-benefit balance, and flags
			safety-critical issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hormone-replacement-therapy-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hormone-replacement-therapy-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed MRS score and severity, HRT risk
				classification, and safety flags, and filter by severity and risk classification.
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
					Capture a structured menopause profile and produce a graded report — MRS total and subscale
					scores, symptom severity, HRT risk classification, and flagged issues — to support HRT
					prescribing decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the MRS grading engine, the HRT
					risk classification, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Menopause Rating Scale (MRS) across somatic, psychological, and urogenital
					subscales, with HRT contraindication screening.
				</dd>
			</div>
		</dl>
	</section>
</main>
