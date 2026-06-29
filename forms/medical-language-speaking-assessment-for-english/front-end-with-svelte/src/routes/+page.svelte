<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the assessment
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'medical-language-speaking-assessments-for-english';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Medical Language Speaking Assessment for English</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Clinical English speaking assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A criterion-based English-language speaking assessment for internationally educated healthcare
			professionals, modelled on the Occupational English Test (OET) Medicine speaking sub-test. The
			assessment is completed as a single continuous wizard: candidate details, two role-played
			patient scenarios, four linguistic criteria (0-6), and five clinical-communication indicators
			(0-3). The shared engine scales the combined band total to the OET 0-500 score, derives the
			letter grade A–E and the registration outcome, and flags issues for the assessment lead.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step examiner form. One continuous single-page wizard that grades the
				candidate as you rate each criterion.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Assessment dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed candidates with their computed OET grade, 0-500 score and registration
				outcome, and filter by grade and outcome.
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
					Capture a structured speaking-test profile and produce a graded report — OET letter grade,
					0-500 score, criterion bands, and flagged issues — to support registration decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the OET scoring engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the OET Speaking sub-test (Medicine) criteria: four linguistic criteria on a 0-6 band
					scale and five clinical-communication indicators on a 0-3 band scale, with grades A–E.
				</dd>
			</div>
		</dl>
	</section>
</main>
