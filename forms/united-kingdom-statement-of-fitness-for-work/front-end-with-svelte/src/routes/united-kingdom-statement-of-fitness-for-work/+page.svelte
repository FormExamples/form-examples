<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the fit-note wizard and the clinician
	// dashboard.
	const plural = 'united-kingdom-statements-of-fitness-for-work';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			UK Statement of Fitness for Work
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Med 3 / fit note</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK Statement of Fitness for Work (Med 3 / fit note) completed as a single continuous wizard —
			issuer and patient identification, assessment, diagnosis, fitness for work, adaptations, period,
			and follow-up — whose shared engine classifies the fitness category, adaptation intensity, and
			period compliance, checks validity, and fires safety flags drawn directly from DWP guidance for
			healthcare professionals.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-statement-of-fitness-for-work/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new fit note</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step fit-note form. One continuous single-page wizard that grades policy
				compliance as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-statement-of-fitness-for-work/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse issued fit notes with their computed fitness category, period compliance, validity,
				and recommendation, and filter by fitness category and recommendation.
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
					Capture a structured fitness-for-work assessment and produce a graded report — fitness
					category, period compliance, validity, recommendation, and flagged issues — to support
					correct, policy-compliant fit-note issuance.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the DWP policy grading engine,
					and the safety-flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the DWP <em>Fit note: guidance for healthcare professionals</em> (2022), the
					Equality Act 2010, and the Social Security (Medical Evidence) Regulations 1976.
				</dd>
			</div>
		</dl>
	</section>
</main>
