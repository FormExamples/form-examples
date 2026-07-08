<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/occupational-therapy-assessments` and
	// `/occupational-therapy-assessments/new`) hold the actual functionality.
	const plural = 'occupational-therapy-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Occupational Therapy Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Functional performance evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured occupational therapy evaluation completed as a single continuous wizard:
			demographics, referral information, self-care, productivity and leisure activities,
			performance and satisfaction ratings, environmental factors, physical and cognitive status,
			and goals. The shared engine grades the patient with the Canadian Occupational Performance
			Measure (COPM), producing average performance and satisfaction scores and flagging issues for
			the occupational therapist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/occupational-therapy-assessment/{plural}/new"
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
			href="/occupational-therapy-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed COPM performance and satisfaction scores, and
				filter by performance and satisfaction category.
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
					Capture a structured occupational profile and produce a graded report — COPM performance
					and satisfaction scores, category labels, and flagged issues — to support occupational
					therapy review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the COPM scoring engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Canadian Occupational Performance Measure (COPM) across self-care, productivity,
					and leisure domains, rated on 1–10 performance and satisfaction scales.
				</dd>
			</div>
		</dl>
	</section>
</main>
