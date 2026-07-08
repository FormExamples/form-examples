<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/hearing-aid-assessments` and
	// `/hearing-aid-assessments/new`) hold the actual functionality.
	const plural = 'hearing-aid-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Hearing Aid Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Hearing aid candidacy evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive hearing aid candidacy evaluation completed as a single continuous wizard:
			demographics, hearing history, the HHIE-S questionnaire, communication difficulties, current
			hearing aids, ear examination, audiogram results, lifestyle and needs, and expectations and
			goals. The shared engine scores the Hearing Handicap Inventory for the Elderly — Screening
			(HHIE-S), grades the worse-ear hearing loss, and flags issues for the audiologist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hearing-aid-assessment/{plural}/new"
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
			href="/hearing-aid-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed HHIE-S score and handicap category, worse-ear
				hearing-loss grade, and flag count, and filter by category and hearing loss.
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
					Capture a structured hearing profile and produce a scored report — HHIE-S score and
					category, hearing-loss grade, and flagged issues — to support audiology review and hearing
					aid candidacy decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the HHIE-S scoring engine, and
					the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the HHIE-S (Hearing Handicap Inventory for the Elderly — Screening) questionnaire and
					the WHO pure-tone-average hearing-loss classification.
				</dd>
			</div>
		</dl>
	</section>
</main>
