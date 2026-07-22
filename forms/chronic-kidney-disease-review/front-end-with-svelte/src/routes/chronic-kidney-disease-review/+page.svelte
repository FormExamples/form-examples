<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review form and the clinician
	// dashboard.
	const plural = 'chronic-kidney-disease-reviews';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/chronic-kidney-disease-review/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step CKD review. One continuous single-page wizard that classifies the
				KDIGO risk zone and grades completeness on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/chronic-kidney-disease-review/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed G-stage, albuminuria stage, KDIGO risk zone, and
				review completeness, and filter by risk zone and completeness.
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
					Record the annual CKD review and produce a graded report — a KDIGO G-stage, albuminuria
					stage, risk zone, a review-completeness status, and flagged issues — to support the
					clinical record and prompt escalation where the risk is very high or a safety criterion
					fires.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the G-stage and A-stage
					boundaries, the KDIGO heat-map, the BP-target derivation, the completeness grading, and the
					flag rules. The same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NICE NG203 and the KDIGO 2012/2024 CKD guidelines. A documentation and
					classification aid, not a diagnosis, and not a prescribing instrument.
				</dd>
			</div>
		</dl>
	</section>
</main>
