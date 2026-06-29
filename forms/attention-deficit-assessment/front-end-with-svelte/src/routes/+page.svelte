<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/attention-deficit-assessments` and
	// `/attention-deficit-assessments/new`) hold the actual functionality.
	const plural = 'attention-deficit-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Attention Deficit Assessment
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Adult ADHD screening (ASRS v1.1)</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured adult ADHD screening completed as a single continuous wizard: demographics, the
			ASRS Part A screener and Part B symptom items, childhood history, functional impact, comorbid
			conditions, medications, allergies, medical history, and social / support context. The shared
			engine scores the WHO Adult ADHD Self-Report Scale (ASRS v1.1), classifies the likelihood of
			ADHD, infers the predominant presentation (subtype), and flags issues for the clinician.
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
				Browse screened patients with their ASRS total, ADHD classification, and predominant
				presentation, and filter by classification and subtype.
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
					Capture a structured ADHD symptom profile and produce a graded report — ASRS total, Part A
					screener result, ADHD classification, predominant presentation, and flagged issues — to
					support clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the ASRS scoring engine, and
					the flag rules. The same engine scores both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the WHO Adult ADHD Self-Report Scale (ASRS) v1.1 — a six-item Part A screener plus a
					twelve-item Part B supplement, with inattentive and hyperactive-impulsive subscores.
				</dd>
			</div>
		</dl>
	</section>
</main>
