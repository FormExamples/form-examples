<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'mental-health-act-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Mental Health Act 1983 (as amended 2007)
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Mental Health Act Assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A statutory-documentation instrument, completed as a single continuous wizard, that records
			the AMHP-coordinated assessment and medical recommendations, classifies the recommended
			section and urgency, and validates documentation completeness — <strong>valid</strong> or
			<strong>incomplete</strong> — with <strong>no numeric score</strong> and
			<strong>no automated decision to detain</strong>.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/mental-health-act-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment. One continuous single-page wizard that classifies and
				validates the documentation as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/mental-health-act-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed people with their computed completeness status, recommended-section class,
				and urgency, and filter by section class and completeness.
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
					Capture a Mental Health Act assessment and produce a graded report — a legal-completeness
					status, a recommended-section classification, an urgency class, the required-signatory and
					criteria checklists, and flagged issues — to support lawful, well-documented decision
					making. Detention decisions rest with the professionals, not this software.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the classification /
					validation engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the Mental Health Act 1983 (as amended 2007) and its Code of Practice. A
					documentation and validation aid, not the prescribed statutory forms, which remain the
					definitive legal record.
				</dd>
			</div>
		</dl>
	</section>
</main>
