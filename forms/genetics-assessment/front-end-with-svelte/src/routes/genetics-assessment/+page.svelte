<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/genetics-assessments` and
	// `/genetics-assessments/new`) hold the actual functionality.
	const plural = 'genetics-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Genetics Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Clinical genetics risk assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinical genetics assessment completed as a single continuous wizard: proband demographics,
			presenting concern, personal medical history, a three-generation family pedigree, ancestry and
			consanguinity, targeted risk scoring, prior genetic testing, patient understanding, and the
			clinician's recommendation and referral plan. The shared engine computes the Manchester score
			for BRCA1/2, counts the Revised Bethesda criteria for Lynch syndrome, records Tyrer-Cuzick and
			PREMM5 results, stratifies overall genetic risk, and flags issues for the clinical geneticist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/genetics-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades genetic
				risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/genetics-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Manchester score, Bethesda count and overall
				genetic risk, and filter by risk level and BRCA testing indication.
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
					Capture a structured genetics profile and produce a graded report — Manchester score,
					Bethesda criteria, PREMM5 and Tyrer-Cuzick results, overall risk, and flagged issues — to
					support clinical genetics review and testing decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the genetics grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned to NICE CG164 / NCCN family-history thresholds, the Manchester Score for BRCA1/2,
					the Revised Bethesda criteria for Lynch syndrome, the Tyrer-Cuzick (IBIS) breast-cancer
					model and the PREMM5 Lynch model. Decision support only — not a substitute for formal
					genetic counselling.
				</dd>
			</div>
		</dl>
	</section>
</main>
