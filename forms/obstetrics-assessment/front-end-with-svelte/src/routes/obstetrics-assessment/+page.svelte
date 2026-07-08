<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the maternity
	// dashboard. The collection routes (`/obstetrics-assessments` and
	// `/obstetrics-assessments/new`) hold the actual functionality.
	const plural = 'obstetrics-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Obstetrics Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Antenatal risk assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A comprehensive antenatal booking and follow-up assessment completed as a single continuous
			wizard: maternal demographics, obstetric history, medical history, current pregnancy details,
			lifestyle and social factors, screening test results, mental-health screening, fetal
			assessment, birth preferences, and care plan. The shared engine stratifies the pregnancy into
			low, moderate, or high risk using NICE NG201, allocates a care pathway, and flags issues for
			the maternity team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/obstetrics-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that stratifies
				antenatal risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/obstetrics-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Maternity team dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed pregnancies with their computed risk level and care pathway, and filter by
				risk and pathway.
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
					Capture a structured antenatal profile and produce a graded report — overall NG201 risk
					level, recommended care pathway, and flagged issues — to support midwifery and obstetric
					review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the NG201 stratification engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE Guideline NG201 (antenatal care), stratifying pregnancies into low,
					moderate, or high risk to allocate midwifery-led, shared, or consultant-led care.
				</dd>
			</div>
		</dl>
	</section>
</main>
