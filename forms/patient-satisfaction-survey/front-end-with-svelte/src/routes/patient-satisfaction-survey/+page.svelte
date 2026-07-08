<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the survey form and the service
	// dashboard. The collection routes (`/patient-satisfaction-surveys` and
	// `/patient-satisfaction-surveys/new`) hold the actual functionality.
	const plural = 'patient-satisfaction-surveys';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Patient Satisfaction Survey
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Healthcare experience feedback</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A Likert-scale patient experience survey completed as a single continuous wizard:
			demographics, visit details, access and waiting times, communication, clinical care quality,
			staff attitude, environment and facilities, discharge and follow-up, overall experience, and
			free-text comments. The shared engine normalizes each care domain to a 0–100 score, derives an
			overall satisfaction category, and flags issues for service quality improvement.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/patient-satisfaction-survey/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new survey</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step survey. One continuous single-page wizard that scores your experience
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the survey →</span>
		</a>
		<a
			href="/patient-satisfaction-survey/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Service dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse completed surveys with their computed satisfaction score and category, and filter by
				category and visit type.
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
					Capture structured patient-reported experience and produce a graded report — a normalized
					0–100 satisfaction score, an overall category, and flagged issues — to support service
					quality improvement.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Likert-scale scoring
					engine, and the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Categories</dt>
				<dd class="mt-1 text-base-content/70">
					Excellent (85–100), Good (70–84), Satisfactory (50–69), Poor (25–49), and Very Poor
					(0–24), derived from the normalized composite score.
				</dd>
			</div>
		</dl>
	</section>
</main>
