<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/sleep-quality-assessments` and
	// `/sleep-quality-assessments/new`) hold the actual functionality.
	const plural = 'sleep-quality-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Sleep Quality Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Pittsburgh Sleep Quality Index</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured, single-page wizard covering sleep habits, latency, duration, efficiency,
			disturbances, daytime dysfunction, medication use, and medical / lifestyle factors, from which
			the shared engine computes the PSQI Global Score, classifies sleep quality, and flags
			safety-critical issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/sleep-quality-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/sleep-quality-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed PSQI score and sleep-quality category, and
				filter by category and snoring flag.
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
					Capture a structured sleep profile and produce a graded report — the PSQI Global Score,
					its sleep-quality category, a component breakdown, and flagged issues — to support sleep
					clinic review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the PSQI grading engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Pittsburgh Sleep Quality Index (PSQI): seven components each scored 0–3 for a
					0–21 global score.
				</dd>
			</div>
		</dl>
	</section>
</main>
