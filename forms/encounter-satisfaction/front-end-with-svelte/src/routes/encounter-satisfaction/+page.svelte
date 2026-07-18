<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the satisfaction survey and the
	// clinician dashboard. The collection routes (`/encounter-satisfactions` and
	// `/encounter-satisfactions/new`) hold the actual functionality.
	const plural = 'encounter-satisfactions';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Encounter Satisfaction</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Patient encounter satisfaction survey</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A patient experience survey, completed as a single continuous wizard across 19 satisfaction
			questions in six domains, that the shared engine grades into the Encounter Satisfaction Score
			(ESS) — a composite mean (1.0–5.0) with satisfaction category and per-domain breakdown — for
			service review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/encounter-satisfaction/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new survey</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step satisfaction survey. One continuous single-page wizard that scores the
				encounter as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/encounter-satisfaction/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse completed surveys with their computed ESS composite score and category, and filter by
				category and first-visit status.
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
					Capture structured patient feedback — demographics, visit information, and 19 satisfaction
					questions across six domains (access &amp; scheduling, communication, staff &amp;
					professionalism, care quality, environment, and overall satisfaction) — and produce a
					scored report: composite ESS, category, per-domain breakdown, and flagged issues, to
					support service-quality review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the 19-question data model, the composite-mean
					scoring engine, and the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					The Encounter Satisfaction Score (ESS) is inspired by PSQ-18 and HCAHPS, using a 5-point
					Likert scale (1 = Very Dissatisfied … 5 = Very Satisfied).
				</dd>
			</div>
		</dl>
	</section>
</main>
