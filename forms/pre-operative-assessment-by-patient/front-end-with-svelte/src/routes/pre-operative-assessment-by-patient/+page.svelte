<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/pre-operative-assessments-by-patient`
	// and `/pre-operative-assessments-by-patient/new`) hold the functionality.
	const plural = 'pre-operative-assessments-by-patient';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/pre-operative-assessment-by-patient/{plural}/new"
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
			href="/pre-operative-assessment-by-patient/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed ASA grade and safety flags, and filter by ASA
				grade and procedure urgency.
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
					Capture a structured pre-operative health profile — spanning demographics, cardiovascular,
					respiratory, renal, hepatic, endocrine, neurological, haematological, musculoskeletal and
					airway, gastrointestinal, medications, allergies, previous anaesthesia, social history,
					functional capacity, and pregnancy — and produce a graded report — ASA Physical Status
					grade and flagged issues — to support anaesthetic planning.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the ASA grading engine (worst
					comorbidity sets the grade), and the safety-flag rules. The same engine grades both the
					form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the American Society of Anesthesiologists (ASA) Physical Status Classification (ASA
					I–V) with declarative rules across 11 body systems.
				</dd>
			</div>
		</dl>
	</section>
</main>
