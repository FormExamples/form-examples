<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the checklist form and the clinician
	// dashboard. The collection routes (`/vaccinations-checklists` and
	// `/vaccinations-checklists/new`) hold the actual functionality.
	const plural = 'vaccinations-checklists';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/vaccinations-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new checklist</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step checklist. One continuous single-page wizard that classifies the
				patient's vaccination compliance as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/vaccinations-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed compliance status and overall exposure risk, and
				filter by compliance and risk level.
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
					Capture a structured immunisation profile and produce a graded report — compliance status,
					overall exposure risk, and flagged issues — to support clinical and occupational-health
					review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the vaccination compliance
					classification engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Covers routine, occupational, travel, and special-circumstance vaccines with compliance
					scoring and risk stratification.
				</dd>
			</div>
		</dl>
	</section>
</main>
