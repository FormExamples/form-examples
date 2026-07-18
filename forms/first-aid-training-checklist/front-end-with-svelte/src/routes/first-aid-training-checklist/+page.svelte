<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the examiner checklist and the training
	// coordinator dashboard. The collection routes hold the actual functionality.
	const plural = 'first-aid-training-checklists';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">First Aid Training Checklist</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">First Aid at Work competency assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK HSE First Aid at Work (FAW) competency assessment, aligned with the St John Ambulance
			syllabus and completed as a single continuous wizard, that the shared engine grades to produce a
			Pass / Needs Development / Fail outcome with flagged issues for the examiner.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/first-aid-training-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step examiner checklist. One continuous single-page wizard that grades the
				trainee as you record each skill.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the checklist →</span>
		</a>
		<a
			href="/first-aid-training-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Training coordinator dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed trainees with their computed outcome, skills demonstrated, critical-skill
				failures, and certification currency, and filter by outcome and role.
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
					Record a structured competency observation — trainee details, scene assessment, the primary
					survey (DRABC), CPR &amp; AED, choking, bleeding, burns, fractures and spinal injury, medical
					emergencies, and recording / handover — and produce a graded report — overall outcome,
					per-skill results, and flagged issues — to support First Aid at Work certification.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the competency grading engine,
					and the flag rules. The same engine grades both the checklist and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with UK HSE First Aid at Work guidance and the St John Ambulance syllabus. Any
					critical life-saving skill failure forces an overall Fail.
				</dd>
			</div>
		</dl>
	</section>
</main>
