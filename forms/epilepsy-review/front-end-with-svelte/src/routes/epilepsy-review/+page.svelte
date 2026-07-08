<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review form and the clinician
	// dashboard.
	const plural = 'epilepsy-reviews';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Epilepsy Annual Review</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Epilepsy review — seizure control, completeness, and safety flags
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK primary-care annual epilepsy review (NICE NG217), completed as a single continuous
			wizard. It captures the position since the last review — seizure type and frequency,
			anti-seizure medication and adherence, triggers, SUDEP discussion, injuries and status
			epilepticus, safety (DVLA driving, bathing), valproate and pregnancy-prevention arrangements
			for women of childbearing potential, mental health, and the care plan. This is a
			<strong>documentation and decision-support</strong> tool, not a numeric score: the engine
			classifies seizure <strong>control</strong> (seizure-free / controlled / uncontrolled), grades
			review <strong>completeness</strong> (complete / partial / incomplete), and — independently —
			raises safety <strong>flags</strong>. It does not diagnose or prescribe.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/epilepsy-review/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step annual review. One continuous single-page wizard that classifies
				seizure control and grades completeness on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/epilepsy-review/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed seizure control and review completeness, and
				filter by control and completeness.
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
					Record the annual epilepsy review and produce a graded report — a seizure-control
					classification, a review-completeness status, and safety flags — to support the clinical
					record and prompt escalation where seizures are uncontrolled or a safety concern is
					present.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the seizure-control
					classification, the completeness grading over required domains, and the safety-flag rules.
					The same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NICE NG217, MHRA valproate guidance, and DVLA fitness-to-drive standards. A
					documentation and decision-support aid, not a diagnosis, and not a prescribing instrument.
				</dd>
			</div>
		</dl>
	</section>
</main>
