<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/renal-assessments` and
	// `/renal-assessments/new`) hold the actual functionality.
	const plural = 'renal-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Renal Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Chronic kidney disease evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured renal (kidney) assessment completed as a single continuous wizard, classified by
			the shared engine's KDIGO 2012/2024 CKD classification — combining GFR category (G1–G5) with
			albuminuria category (A1–A3) into a composite risk level.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/renal-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that classifies the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/renal-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed KDIGO GFR / albuminuria categories and composite
				risk level, and filter by risk and GFR category.
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
					Capture a structured renal profile — demographics, presenting symptoms, CKD risk factors,
					physical examination, blood tests, urine tests, imaging and biopsy review, medication
					review, and clinical impression — and produce a classified report — KDIGO GFR category,
					albuminuria category, composite risk level, and flagged issues — to support nephrology
					review and referral.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the KDIGO classification engine,
					and the flag rules. The same engine classifies both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the KDIGO 2012/2024 CKD classification (GFR × Albuminuria heatmap) with eGFR estimated
					via the CKD-EPI 2021 race-free equation.
				</dd>
			</div>
		</dl>
	</section>
</main>
