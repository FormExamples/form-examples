<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the issue form and the triage
	// dashboard. The collection routes (`/issues` and `/issues/new`) hold the
	// actual functionality.
	const plural = 'issues';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Issue Tracker</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Report and triage any issue</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A general-purpose issue tracker completed as a single continuous wizard: reporter and metadata,
			chief complaint, participants, symptoms, fractures, history, investigations, diagnosis,
			treatments and prognosis, and scores. The shared engine grades the issue on seven independent
			scales — priority rank, severity of impact, magnitude of damage, harm grade, failure condition,
			MoSCoW requirement, and frequency — and derives a composite priority plus safety flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Report a new issue</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step issue form. One continuous single-page wizard that grades the issue as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Triage dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reported issues with their computed composite priority, severity, harm grade, and
				flag count, and filter by priority and category.
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
					Capture any reportable problem — bug, outage, safety event, complaint, or blocker — and
					produce a graded report: a composite priority, the seven raw scores, and flagged issues to
					support triage.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the seven-scale max-grade
					engine, and the safety-flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scales</dt>
				<dd class="mt-1 text-base-content/70">
					Borrows established severity scales: NHS LFPSE harm grade, FAA / EASA failure conditions,
					a Saffir-Simpson-style severity, a Richter-style magnitude, MoSCoW prioritisation, and a
					frequency-of-occurrence percentage.
				</dd>
			</div>
		</dl>
	</section>
</main>
