<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/sundowner-syndrome-assessments` and
	// `/sundowner-syndrome-assessments/new`) hold the actual functionality.
	const plural = 'sundowner-syndrome-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Sundowner Syndrome Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Sundowning evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured evaluation of sundowner syndrome (sundowning) in elderly patients, particularly
			those with dementia, completed as a single continuous wizard: demographics, cognitive status,
			behavioural symptoms, temporal pattern, triggers, sleep-wake cycle, medication review,
			environmental assessment, carer impact, and management plan. The shared engine scores the
			Cohen-Mansfield Agitation Inventory (CMAI) and the Neuropsychiatric Inventory (NPI), classifies
			a severity band, and flags issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed CMAI / NPI totals and severity band, and filter
				by severity and CMAI total.
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
					Capture a structured behavioural profile and produce a graded report — CMAI total, NPI
					total, severity band, and flagged issues — to support clinical review and management of
					sundowning.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the CMAI / NPI scoring engine,
					and the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Cohen-Mansfield Agitation Inventory (CMAI; 29 items, range 29-203) and the
					Neuropsychiatric Inventory (NPI; 12 domains, range 0-144). Severity bands: mild (29-45),
					moderate (46-75), severe (76-120), critical (&gt;120).
				</dd>
			</div>
		</dl>
	</section>
</main>
