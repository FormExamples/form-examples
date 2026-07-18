<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the meeting form and the dashboard.
	// The collection routes (`/meetings` and `/meetings/new`) hold the actual
	// functionality.
	const plural = 'meetings';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Meeting</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">General-purpose meeting record</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A general-purpose meeting record, captured as a single continuous wizard, whose shared
			validation engine checks for structural problems — such as a missing organiser, no
			participants, an over-long summary, scheduling errors, or overdue actions — and produces an
			overall health verdict with flagged issues.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/meeting/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Record a new meeting</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step meeting form. One continuous single-page wizard that validates the
				record as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/meeting/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Meeting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded meetings with their duration, acceptance, open actions, outcomes and overall
				health, and filter by health and status.
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
					Capture a structured meeting record — plan (invitation, agenda, participants, resources,
					recurrence) and results (summary, action items, outputs, outcomes) — and produce a signed
					report with an overall health verdict and flagged issues.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validation engine, and the
					flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Recurrence follows RFC 5545 (iCalendar) RRULE shapes; reports can round-trip to
					iCalendar, FHIR R5 Appointment / Encounter, XML and Protocol Buffers.
				</dd>
			</div>
		</dl>
	</section>
</main>
