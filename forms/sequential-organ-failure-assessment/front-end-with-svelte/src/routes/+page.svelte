<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'sequential-organ-failure-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Sequential Organ Failure Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">SOFA organ-dysfunction score</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinician-driven Sequential Organ Failure Assessment for critically ill adults, completed as
			a single continuous wizard. Six organ systems — respiration, coagulation, liver,
			cardiovascular, central nervous system, and renal — are each scored 0 to 4 from objective
			physiology and laboratory findings, for a total of 0 to 24. The shared engine sums the total,
			derives delta-SOFA versus a baseline, bands the mortality risk, sets the Sepsis-3 flag when an
			acute rise of &ge; 2 points accompanies suspected infection, and raises safety flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step SOFA score. One continuous single-page wizard that scores each organ
				system as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed total SOFA, delta-SOFA, mortality band, and
				Sepsis-3 status, and filter by care location and mortality band.
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
					Capture the six SOFA organ-system inputs and produce a graded report — per-system
					sub-scores, total 0-24, delta-SOFA, mortality band, Sepsis-3 flag, and flagged issues — to
					quantify organ dysfunction and support timely escalation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-system threshold
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Vincent et al. (Intensive Care Medicine 1996; Critical Care Medicine 1998),
					Ferreira et al. (JAMA 2001), and the Sepsis-3 consensus (Singer et al., JAMA 2016). A
					decision-support instrument, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
