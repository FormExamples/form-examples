<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the survey form and the HR dashboard.
	// The collection routes (`/employee-satisfaction-surveys` and
	// `/employee-satisfaction-surveys/new`) hold the actual functionality.
	const plural = 'employee-satisfaction-surveys';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Employee Satisfaction Survey</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Workplace experience survey</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			An anonymous employee satisfaction survey completed as a single continuous wizard across ten
			short topics: demographics, role and tenure, workload and work-life balance, management and
			leadership, growth and development, compensation and benefits, culture and inclusion,
			environment and resources, recognition and engagement, and overall experience. The shared
			engine normalises each 1–5 Likert domain to a 0–100 score, averages them into a composite,
			classifies the result, derives an eNPS classification, and flags issues for HR review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new survey</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step survey. One continuous single-page wizard that scores your experience
				when you submit. Your responses are anonymous.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the survey →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">HR dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted surveys with their computed composite score, satisfaction category and eNPS
				classification, and filter by category and eNPS.
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
					Capture a structured, anonymous picture of employee experience and produce a graded report
					— composite score, satisfaction category, eNPS, and flagged issues — to inform retention,
					engagement and culture programmes.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Likert composite scoring
					engine, the eNPS classification, and the flag rules. The same engine grades both the form
					and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Methodology</dt>
				<dd class="mt-1 text-base-content/70">
					Eight graded domains of positively-worded 1–5 Likert items, each normalised to 0–100
					(mean × 20) and averaged into a composite. eNPS uses the standard 0–10 promoter / passive /
					detractor bands.
				</dd>
			</div>
		</dl>
	</section>
</main>
