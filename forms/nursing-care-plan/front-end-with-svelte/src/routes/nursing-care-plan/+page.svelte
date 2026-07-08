<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the care-plan wizard and the clinician
	// dashboard.
	const plural = 'nursing-care-plans';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Nursing Care Plan</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Document care through the nursing process (ADPIE)
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Build an individualised nursing care plan as a single continuous wizard. Record the identified
			problems and needs, then work each one through the nursing process &mdash; assessment,
			diagnosis, planning (SMART goals), implementation (interventions), and evaluation &mdash;
			organised by the Roper&ndash;Logan&ndash;Tierney activities of living. The shared completeness
			engine grades each problem Complete, Partial, or Incomplete, rolls that up to a plan status,
			reports a completeness percent, and raises flagged issues. This is a documentation-and-
			completeness instrument, not a numeric score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/nursing-care-plan/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new care plan</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step wizard. One continuous single-page form with repeating editors for
				problems, and nested editors for each problem's goals and interventions.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/nursing-care-plan/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse care plans with their computed status, completeness percent, problem count, and
				flagged-issue count, and filter by care setting and status.
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
					Document the plan of care and produce a graded report &mdash; care-plan status,
					completeness percent, per-problem classes, and flagged issues &mdash; suitable for the
					nursing notes and handover.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the relational data model (plan, problems,
					goals, interventions), the completeness engine, and the flag rules. The same engine grades
					both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in the Roper&ndash;Logan&ndash;Tierney model, the NMC Code, and RCN record-keeping
					guidance. It records that specialist risk assessments (falls, pressure ulcer, VTE, MUST)
					were done and their outcome; it does not replace them.
				</dd>
			</div>
		</dl>
	</section>
</main>
