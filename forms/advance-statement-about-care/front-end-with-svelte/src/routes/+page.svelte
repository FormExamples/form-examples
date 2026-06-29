<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the statement form and the clinician
	// dashboard. The collection routes (`/advance-statements-about-care` and
	// `/advance-statements-about-care/new`) hold the actual functionality.
	const plural = 'advance-statements-about-care';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Advance Statement About Care</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Record wishes and preferences for future care</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured advance statement completed as a single continuous wizard: personal information,
			statement context, values and beliefs, care preferences, medical treatment wishes, communication
			preferences, people important to me, practical matters, and signatures and witnesses. The shared
			engine assesses the statement for completeness, classifies it as Incomplete, Partial, Complete, or
			Verified, lists missing sections, and flags documentation and validity issues for review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new statement</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step statement form. One continuous single-page wizard that assesses the
				statement for completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded statements with their computed completeness level and witness status, and
				filter by completeness and witness status.
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
					Capture a person's wishes and preferences about future care and produce a completeness
					assessment — overall level, completed and missing sections, and flagged validity issues — to
					support care planning and best-interests decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness rules engine,
					and the flag rules. The same engine assesses both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Recorded in accordance with the Mental Capacity Act 2005 and NHS guidance. This is an advance
					statement of wishes, not a legally binding Advance Decision to Refuse Treatment (ADRT).
				</dd>
			</div>
		</dl>
	</section>
</main>
