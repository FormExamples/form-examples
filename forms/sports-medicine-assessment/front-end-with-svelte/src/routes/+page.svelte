<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/sports-medicine-assessments` and
	// `/sports-medicine-assessments/new`) hold the actual functionality.
	const plural = 'sports-medicine-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Sports Medicine Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Pre-participation physical evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A pre-participation physical evaluation (PPE) completed as a single continuous wizard:
			demographics, sport &amp; position details, medical and family history, menstrual / RED-S
			screening, cardiovascular and musculoskeletal screening, neurological &amp; concussion
			baseline, vision &amp; skin, and the clearance decision. The shared engine aggregates the PPE
			rules into a single clearance decision — Cleared, Cleared with Conditions, Not Cleared Pending
			Further Evaluation, or Not Cleared for Sport — and flags issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step PPE form. One continuous single-page wizard that computes the clearance
				decision when you submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed athletes with their computed PPE clearance decisions and safety flags, and
				filter by clearance and contact level.
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
					Capture a structured athlete profile and produce a graded report — PPE clearance decision,
					rule audit trail, and flagged issues — to support clearance for sport.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the PPE rule engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Modelled on the AAP / AAFP / ACSM / AMSSM / AOSSM / AOASM Pre-Participation Physical
					Evaluation, 5th edition.
				</dd>
			</div>
		</dl>
	</section>
</main>
