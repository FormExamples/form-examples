<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment wizard and the review
	// dashboard. The collection routes (`/dietic-assessments` and
	// `/dietic-assessments/new`) hold the actual functionality.
	const plural = 'dietic-assessments';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/dietic-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step dietetic assessment. One continuous single-page wizard across sixteen
				steps that scores MUST and GLIM as you complete it, and saves the draft as you work.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/dietic-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded assessments with their MUST score, GLIM diagnosis, refeeding risk, and
				composite nutrition risk, and filter by any of them.
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
					A comprehensive evaluation of a patient's nutritional status, eating patterns, medical
					history, and food environment, conducted by a registered dietitian. It covers the five
					assessment domains — medical history, medication and supplements, dietary recall,
					lifestyle and environment, and physical measurements — and produces a nutrition diagnosis
					and a signed care plan. An initial appointment typically runs 45 to 60 minutes, and up to
					90 minutes for a specialist programme.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scoring</dt>
				<dd class="mt-1 text-base-content/70">
					MUST (BAPEN) is the primary instrument, with GLIM for the malnutrition diagnosis and
					NRS-2002, SARC-F, SCOFF, and the NICE CG32 refeeding-syndrome criteria alongside it. The
					composite nutrition risk uses a max-grade algorithm, so the worst finding sets the band and
					a single critical result cannot be averaged away. Safety flags are computed independently
					and are never suppressed by a dietitian override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Dignity</dt>
				<dd class="mt-1 text-base-content/70">
					Being weighed distresses some patients. A declined weight is an ordinary answer here: the
					MUST body mass index component is estimated from mid-upper-arm circumference instead, and
					the report says the score is an estimate. Declining never blocks completion.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the scoring engine, and the
					safety-flag rules. The same pure engine grades both the form and the dashboard, and the
					HTML front-end runs an identical implementation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Status</dt>
				<dd class="mt-1 text-base-content/70">
					Clinical decision support. It does not make a diagnosis and does not replace the clinical
					judgement of a registered dietitian, who must sign the assessment before the report is
					final.
				</dd>
			</div>
		</dl>
	</section>
</main>
