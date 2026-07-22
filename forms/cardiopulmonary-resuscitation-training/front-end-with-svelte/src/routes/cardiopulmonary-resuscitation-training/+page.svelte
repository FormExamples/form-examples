<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the skills-verification form and the
	// training coordinator dashboard.
	const plural = 'cardiopulmonary-resuscitation-trainings';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cardiopulmonary-resuscitation-training/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new verification</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step skills checklist. One continuous single-page wizard that grades the
				trainee Pass or Fail as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cardiopulmonary-resuscitation-training/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Coordinator dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed trainees with their Pass / Fail outcome, critical-action failures, and
				deficiency counts, and filter by outcome and role.
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
					Capture a structured BLS skills observation and produce a graded report — Pass or Fail,
					with critical-action failures, non-critical deficiencies, and flagged issues — to certify
					rescuers and target remediation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the checklist data model, the pass/fail grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the AHA / Resuscitation Council (UK) BLS guidelines. Critical actions:
					compressions at 100-120/min and 5-6 cm depth, effective ventilation with visible chest
					rise, and AED delivery without unsafe contact.
				</dd>
			</div>
		</dl>
	</section>
</main>
