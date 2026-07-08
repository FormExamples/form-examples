<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/semaglutide-assessments` and
	// `/semaglutide-assessments/new`) hold the actual functionality.
	const plural = 'semaglutide-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Semaglutide Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">GLP-1 receptor agonist eligibility screening</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured semaglutide eligibility screen completed as a single continuous wizard:
			demographics, indication and goals, body composition, metabolic profile, cardiovascular risk,
			contraindications screening, gastrointestinal history, current medications, mental-health
			screening, and treatment plan. The shared engine determines an eligibility status
			(Eligible / Conditional / Ineligible) from absolute and relative contraindications, derives BMI
			and its category, and flags safety-critical monitoring issues for the prescriber.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/semaglutide-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that determines
				eligibility as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/semaglutide-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed eligibility status, BMI, and primary indication,
				and filter by eligibility and indication.
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
					Capture a structured profile and produce a graded report — eligibility status, BMI category,
					contraindications, and flagged monitoring issues — to support safe semaglutide prescribing.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the eligibility grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Screens absolute contraindications (e.g. personal/family history of medullary thyroid
					carcinoma, MEN2, pancreatitis, pregnancy) and relative contraindications, and applies BMI
					thresholds for the weight-management indication.
				</dd>
			</div>
		</dl>
	</section>
</main>
