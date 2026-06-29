<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/mental-health-assessments` and
	// `/mental-health-assessments/new`) hold the actual functionality.
	const plural = 'mental-health-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Mental Health Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Depression and anxiety screening</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A combined mental-health screen completed as a single continuous wizard: demographics, the
			PHQ-9 depression screen, the GAD-7 anxiety screen, mood and affect, risk assessment, substance
			use, current medications, treatment history, and social / functional status. The shared engine
			scores the patient with the PHQ-9 (0–27) and GAD-7 (0–21) instruments, derives severity bands,
			and flags safety-critical issues for the clinician.
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
				Browse assessed patients with their computed PHQ-9 / GAD-7 scores and severity bands, and
				filter by depression and anxiety severity.
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
					Capture a structured mental-health profile and produce a scored report — PHQ-9 depression
					score, GAD-7 anxiety score, severity bands, and flagged safety issues — to support
					clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the PHQ-9 / GAD-7 scoring
					engine, and the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Patient Health Questionnaire-9 (PHQ-9) depression screen and the Generalised
					Anxiety Disorder-7 (GAD-7) anxiety screen, with an AUDIT-C alcohol screen for flagging.
				</dd>
			</div>
		</dl>
	</section>
</main>
