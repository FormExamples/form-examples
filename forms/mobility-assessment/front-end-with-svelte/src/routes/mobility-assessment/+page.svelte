<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/mobility-assessments` and
	// `/mobility-assessments/new`) hold the actual functionality.
	const plural = 'mobility-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Mobility Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Balance, gait and fall-risk evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured balance and gait evaluation completed as a single continuous wizard: demographics,
			referral, fall history, balance and gait assessment, Timed Up and Go, range of motion, assistive
			devices, medications, and functional independence. The shared engine grades the patient with the
			Tinetti Performance-Oriented Mobility Assessment (POMA), stratifies fall risk, and flags issues
			for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/mobility-assessment/{plural}/new"
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
			href="/mobility-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed Tinetti score, fall-risk stratification and Timed
				Up and Go time, and filter by fall risk and assistive-device use.
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
					Capture a structured mobility profile and produce a graded report — Tinetti total (0-28),
					balance and gait subscores, fall-risk category, and flagged issues — to support clinical
					review and fall-prevention planning.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Tinetti grading engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Tinetti Performance-Oriented Mobility Assessment (POMA): 25-28 = low fall risk,
					19-24 = moderate fall risk, 0-18 = high fall risk.
				</dd>
			</div>
		</dl>
	</section>
</main>
