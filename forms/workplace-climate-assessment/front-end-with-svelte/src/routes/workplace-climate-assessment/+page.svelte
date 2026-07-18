<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the questionnaire and the leadership
	// dashboard. The collection routes (`/workplace-climate-assessments` and
	// `/workplace-climate-assessments/new`) hold the actual functionality.
	const plural = 'workplace-climate-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Workplace Climate Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Organisational climate survey</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			An anonymous Workplace Climate Index questionnaire whose shared engine averages eight
			Likert-scored organisational domains into a composite climate index, bands it Thriving /
			Healthy / Developing / Strained / Critical, and raises flagged issues for HR and leadership.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/workplace-climate-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new response</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step questionnaire. One continuous single-page wizard that scores your
				responses as you complete it. Your answers are anonymous.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the questionnaire →</span>
		</a>
		<a
			href="/workplace-climate-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Leadership dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse anonymous responses with their computed Workplace Climate Index, climate category and
				lowest-scoring domain, and filter by category and domain.
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
					Measure organisational culture, psychological safety, and employee experience via 1-5
					Likert items across leadership, psychological safety, inclusion and belonging,
					communication, collaboration, recognition, wellbeing, career development, and an overall
					climate view, normalising each domain to 0-100 and averaging the eight graded domains
					into a composite climate index to inform leadership, inclusion and wellbeing programmes.
					This is an engagement and screening tool, not a clinical instrument.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the Likert instrument, the 0-100 normalisation
					and composite, and the flag rules. The same engine grades both the questionnaire and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Anonymity</dt>
				<dd class="mt-1 text-base-content/70">
					Demographic questions capture broad banding only (department, tenure, hours, role level,
					location) so no individual can be singled out. Free-text answers are scanned for possible
					identifying details so reviewers can redact before sharing.
				</dd>
			</div>
		</dl>
	</section>
</main>
