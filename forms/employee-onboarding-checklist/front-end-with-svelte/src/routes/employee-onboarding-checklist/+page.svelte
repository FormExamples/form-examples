<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the onboarding checklist form and the
	// HR dashboard. The collection routes (`/employee-onboarding-checklists` and
	// `/employee-onboarding-checklists/new`) hold the actual functionality.
	const plural = 'employee-onboarding-checklists';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Employee Onboarding Checklist</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Healthcare staff onboarding</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured onboarding checklist for healthcare staff completed as a single continuous wizard:
			employee details, pre-employment checks, occupational health, mandatory training, professional
			registration, IT systems and access, uniform and ID badge, induction programme, probation and
			supervision, and sign-off and compliance. The shared engine computes a completion percentage,
			derives an overall onboarding risk level, and flags outstanding items for HR.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/employee-onboarding-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new checklist</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step onboarding form. One continuous single-page wizard that tracks
				completion as you work through it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/employee-onboarding-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">HR dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse onboarding records with their computed completion status and overall risk level, and
				filter by risk and completion status.
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
					Capture a structured onboarding profile and produce a graded report — completion
					percentage, completion status, overall risk, and flagged items — to support HR review and
					safe deployment of new staff.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completion grading engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Reflects NHS pre-employment standards (DBS, right to work, references), occupational health
					clearance, statutory and mandatory training, and professional registration requirements.
				</dd>
			</div>
		</dl>
	</section>
</main>
