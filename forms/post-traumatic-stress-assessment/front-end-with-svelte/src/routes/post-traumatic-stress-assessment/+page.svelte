<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/post-traumatic-stress-assessments` and
	// `/post-traumatic-stress-assessments/new`) hold the actual functionality.
	const plural = 'post-traumatic-stress-assessments';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/post-traumatic-stress-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step PCL-5 form. One continuous single-page wizard that scores the patient
				when you submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/post-traumatic-stress-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed PCL-5 total score and severity category, and
				filter by category and probable-PTSD status.
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
					Capture a structured trauma-symptom profile across the four DSM-5 symptom clusters —
					intrusion (B), avoidance (C), negative alterations in cognitions and mood (D), and
					alterations in arousal and reactivity (E) — and produce a graded report — PCL-5 total
					score, severity category, DSM-5 provisional-diagnosis status, and flagged issues — to
					support clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the PCL-5 scoring engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the PCL-5 (PTSD Checklist for DSM-5): 20 items, each rated 0-4 over the past month,
					with a provisional PTSD cut-off of 33. The PCL-5 is a screening instrument — a formal
					diagnosis requires a structured clinical interview such as CAPS-5.
				</dd>
			</div>
		</dl>
	</section>
</main>
