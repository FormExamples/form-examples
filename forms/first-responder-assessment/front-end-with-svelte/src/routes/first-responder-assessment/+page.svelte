<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/first-responder-assessments` and
	// `/first-responder-assessments/new`) hold the actual functionality.
	const plural = 'first-responder-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">First Responder Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Responder fitness &amp; competency</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive first responder fitness and competency evaluation, completed as a single
			continuous wizard, that the shared engine grades across domains to derive an overall fitness
			decision and risk level for the assessor.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/first-responder-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				responder as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/first-responder-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Assessor dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed responders with their computed overall competency, fitness decision, and risk
				level, and filter by fitness decision and risk.
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
					Capture a structured competency profile — demographics, role and qualifications, physical
					fitness, clinical skills, equipment and vehicle competency, communication skills,
					psychological readiness, occupational health, and CPD and training — and produce a graded
					report — overall competency, fitness decision, risk level, and flagged issues — to support
					occupational fitness review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the competency grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses a First Responder Competency Framework with four competency levels (Not Competent,
					Developing, Competent, Expert) and four overall fitness decisions.
				</dd>
			</div>
		</dl>
	</section>
</main>
