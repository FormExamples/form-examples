<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the record form and the clinician
	// dashboard. The collection routes (`/return-to-work-records` and
	// `/return-to-work-records/new`) hold the actual functionality.
	const plural = 'return-to-work-records';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Return to Work</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Statement of Fitness for Work</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinician-issued certificate authorising an employee's return to work after illness,
			injury, or extended absence, completed as a single continuous twelve-step wizard: clinician
			and patient identification, job context, absence history, reason for absence, current
			treatment, functional assessment, fitness statement, phased-return plan, workplace
			adjustments, follow-up plan, and sign-off. The shared engine derives the fitness statement
			(fit / may be fit / not fit), a restriction-priority grade (routine / standard / restricted /
			high-risk) by the max-grade rule, and safety flags for the occupational-health team. Aligned
			with the UK NHS Med 3 "Fit Note".
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step record form. One continuous single-page wizard that computes the
				fitness statement and restriction priority as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed employees with their computed fitness statement and restriction priority,
				and filter by fitness and priority.
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
					Capture a structured clinician assessment of an employee's fitness to resume work and
					produce a signed Statement of Fitness for Work — fitness status, restriction priority,
					and flagged issues — to share with the employer's occupational-health team.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the fitness and restriction
					engine (max-grade rule), and the safety-flag rules. The same engine grades both the form
					and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the UK DWP Med 3 "Fit Note" guidance, HSE RIDDOR reporting, DVLA fitness-to-
					drive standards, and the Equality Act 2010 reasonable-adjustment duty.
				</dd>
			</div>
		</dl>
	</section>
</main>
