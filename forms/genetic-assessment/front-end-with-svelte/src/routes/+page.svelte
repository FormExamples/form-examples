<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/genetic-assessments` and
	// `/genetic-assessments/new`) hold the actual functionality.
	const plural = 'genetic-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Genetic Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Genetic counselling referral</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured genetic counselling referral assessment completed as a single continuous wizard:
			demographics, referral information, personal medical history, cancer history, family pedigree,
			cardiovascular genetics, neurogenetics, reproductive genetics, ethnic background and
			consanguinity, and prior genetic testing. The shared engine applies weighted risk-factor
			scoring to stratify the patient as Low, Moderate, or High risk, and flags clinically
			significant issues for the genetic counsellor.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				patient's genetic risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed risk score and level, and filter by risk level
				and referral urgency.
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
					Capture a structured genetic and family history and produce a graded report — a weighted
					risk score, a Low / Moderate / High risk level, and flagged issues — to support genetic
					counselling triage.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the weighted risk-scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Covers cancer genetics, cardiovascular genetics, neurogenetics, and reproductive genetics,
					with stratification into Low (0–2), Moderate (3–5), and High (6+) risk.
				</dd>
			</div>
		</dl>
	</section>
</main>
