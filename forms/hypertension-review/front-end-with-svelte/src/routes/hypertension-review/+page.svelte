<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review form and the clinician
	// dashboard.
	const plural = 'hypertension-reviews';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Hypertension Annual Review
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Hypertension review — control, stage, and completeness
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK primary-care annual hypertension review (NICE NG136), completed as a single continuous
			wizard, that is a <strong>documentation and control-classification</strong> tool, not a numeric
			score — the engine classifies blood-pressure <strong>control</strong> (controlled /
			uncontrolled / severe uncontrolled) against an age- and comorbidity-specific target, assigns a
			hypertension <strong>stage</strong>, and grades review <strong>completeness</strong>, without
			diagnosing or prescribing.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hypertension-review/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step annual review. One continuous single-page wizard that classifies
				control and grades completeness on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hypertension-review/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed control class, hypertension stage, and review
				completeness, and filter by control and completeness.
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
					Record the annual hypertension review — clinic and home/ambulatory blood pressure,
					medication and adherence, cardiovascular risk (QRISK), annual bloods, urine
					albumin:creatinine ratio, lifestyle, and complications — and produce a graded report: a
					control classification, a hypertension stage, a review-completeness status, and flagged
					issues, to support the clinical record and prompt escalation where blood pressure is
					severe or uncontrolled.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the tightest-target selection,
					the control and stage classification, the completeness grading, and the flag rules. The
					same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NICE NG136, NICE CG181, NICE NG203, and QRISK3. A documentation and
					control-classification aid, not a diagnosis, and not a prescribing instrument.
				</dd>
			</div>
		</dl>
	</section>
</main>
