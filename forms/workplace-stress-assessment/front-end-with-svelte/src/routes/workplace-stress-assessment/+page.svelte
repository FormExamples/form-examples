<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the employee survey and the
	// occupational-health dashboard. The collection routes
	// (`/workplace-stress-assessments` and `/workplace-stress-assessments/new`)
	// hold the actual functionality.
	const plural = 'workplace-stress-assessments';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/workplace-stress-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new survey</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step questionnaire. One continuous single-page wizard that scores your
				responses across the seven HSE domains.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the survey →</span>
		</a>
		<a
			href="/workplace-stress-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Occupational-health dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse anonymous responses with their computed overall concern level and worst domain, and
				filter by concern level and department.
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
					Measure perceived work-related stress via 35 statements across seven HSE Management
					Standards domains — demands, control, manager support, peer support, relationships, role
					clarity, and organisational change — scored against HSE percentile benchmarks, and
					identify teams or individuals at elevated risk of work-related ill health.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Anonymity</dt>
				<dd class="mt-1 text-base-content/70">
					Responses are anonymous. Demographic questions are deliberately broad (department, tenure
					band, hours band) so that no individual can be singled out from the aggregate dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the 35-item data model, the reverse-coding and
					HSE benchmark grading engine, and the flag rules. The same engine scores both the survey
					and the dashboard.
				</dd>
			</div>
		</dl>
		<p class="mt-6 text-xs text-base-content/60">
			This screening tool produces a benchmarked indication of risk; it is not a clinical diagnosis.
			If you are personally in distress, please speak to your GP or contact a confidential support
			line such as Samaritans on 116 123 (UK).
		</p>
	</section>
</main>
