<script lang="ts">
	const plural = 'diabetes-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Diabetes Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Structured diabetes review</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A single continuous wizard aligned with NICE NG28 / NG17 and the Diabetes UK 15 Healthcare
			Essentials: patient information, diabetes history, glycaemic control, medications, complications
			screening, cardiovascular risk, self-care, psychological wellbeing, foot assessment, and care
			plan. The shared engine derives a control level and composite score from HbA1c and risk factors,
			and flags issues for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/diabetes-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step review form. One continuous single-page wizard that grades control as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/diabetes-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed diabetes control level and composite score.
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
					Capture a structured diabetes-review profile and produce a graded report — control level,
					composite score, and flagged issues — to support clinical review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the HbA1c-target + composite-risk
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE NG28 (type 2) / NG17 (type 1) and the Diabetes UK 15 Healthcare Essentials.
				</dd>
			</div>
		</dl>
	</section>
</main>
