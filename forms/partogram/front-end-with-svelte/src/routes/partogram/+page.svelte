<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the partogram wizard and the clinician
	// dashboard.
	const plural = 'partograms';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/partogram/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new partogram</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step record. One continuous single-page wizard that classifies labour
				progress and flags issues as you add timed observations.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/partogram/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse partograms with their computed progress classification, latest dilatation, elapsed
				hours, and flag count, and filter by care setting and progress.
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
					Record labour progress &mdash; cervical dilatation, descent, contractions, fetal heart rate,
					liquor and moulding, maternal vitals, urine, and drugs/oxytocin &mdash; and produce a report
					&mdash; progress classification, reference-line expectations, the observation series, and
					flagged issues &mdash; to support safe, auditable intrapartum care.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the alert / action reference-line
					geometry, and the threshold-flag rules. The same engine drives both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the WHO Labour Care Guide (2020), WHO intrapartum-care recommendations (2018),
					the Philpott and Castle cervicograph (1972), and NICE NG235 intrapartum care (2023). A
					documentation and progress-monitoring instrument, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
