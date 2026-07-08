<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the prescription request form and the
	// clinician dashboard. The collection routes (`/prescription-requests` and
	// `/prescription-requests/new`) hold the actual functionality.
	const plural = 'prescription-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Prescription Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Prescription request with priority classification</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A prescription request completed as a single continuous wizard: patient information, clinician
			information, prescription details, substitution options, and request type. The shared engine
			classifies each request by priority — Routine, Urgent, or Emergency — and flags issues for
			clinician review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/prescription-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that classifies the
				request as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/prescription-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse prescription requests with their computed priority classification and flag counts, and
				filter by priority and request type.
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
					Capture a structured prescription request and produce a classified report — priority level,
					classification justification, and flagged issues — to support safe dispensing.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the priority classification
					engine, and the flag rules. The same engine drives both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Priority classification: Routine (standard processing), Urgent (requires prompt attention),
					and Emergency (immediate action required).
				</dd>
			</div>
		</dl>
	</section>
</main>
