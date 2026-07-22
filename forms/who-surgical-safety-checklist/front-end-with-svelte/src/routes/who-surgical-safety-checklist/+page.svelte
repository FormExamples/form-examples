<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the checklist form and the clinician
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'who-surgical-safety-checklists';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/who-surgical-safety-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new checklist</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step checklist. One continuous single-page wizard that tracks the three
				phases and flags safety issues as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/who-surgical-safety-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse surgical cases with their computed lifecycle status and safety-flag count, and filter
				by status and urgency.
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
					Capture case details, then the three WHO safety phases — Sign In (before induction), Time
					Out (before incision), and Sign Out (before leaving the operating room) — and produce a
					signed, timestamped record with a computed lifecycle status, the operating-team roster,
					and any safety flags or escalations noted during the case.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the three-phase completion
					engine, and the safety-flag rules. The same engine powers both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the World Health Organization <em>Safe Surgery Saves Lives</em> Starter Kit
					(WHO/IER/PSP/2008.05).
				</dd>
			</div>
		</dl>
	</section>
</main>
