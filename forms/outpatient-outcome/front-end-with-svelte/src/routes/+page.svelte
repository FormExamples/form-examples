<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the outcome report form and the
	// clinician dashboard. The collection routes (`/outpatient-outcomes` and
	// `/outpatient-outcomes/new`) hold the actual functionality.
	const plural = 'outpatient-outcomes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Outpatient Outcome</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Outpatient outcome report</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured outpatient outcome report completed as a single continuous wizard: patient and
			encounter details, operational efficiency, clinical outcome, patient-reported outcome measures
			(EQ-5D-5L, Global Rating of Change, PROMIS Global Health), the Friends and Family Test, the
			follow-up plan, and sign-off. The shared OOCG engine grades each of four domains A–E and takes
			the overall grade as the worst domain, flagging issues for review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new report</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step report form. One continuous single-page wizard that grades the
				outpatient episode as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse graded outcome reports with their four OOCG domain grades and overall grade, and
				filter by overall grade and specialty.
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
					Capture a structured outpatient outcome and produce a graded report — clinical, PROM, PREM,
					and operational domain grades, an overall OOCG grade, and flagged issues — to support
					service review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the OOCG grading engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Outpatient Outcome Composite Grade (OOCG): EQ-5D-5L, Global Rating of Change,
					PROMIS Global Health v1.2, the NHS Friends and Family Test, and NHS attendance outcome
					codes.
				</dd>
			</div>
		</dl>
	</section>
</main>
