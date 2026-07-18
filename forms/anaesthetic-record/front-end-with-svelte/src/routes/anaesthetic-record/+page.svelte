<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the record wizard and the clinician
	// dashboard.
	const plural = 'anaesthetic-records';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Anaesthetic Record</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Intra-operative anaesthesia chart</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A contemporaneous intra-operative anaesthetic record, completed as a single continuous wizard,
			graded by the shared engine for completeness and, independently, for safety flags.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/anaesthetic-record/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step chart. One continuous single-page wizard that grades completeness and
				flags safety issues as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/anaesthetic-record/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse anaesthetic records with their computed completeness status, completeness percent, and
				safety-flag count, and filter by urgency and status.
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
					Document an anaesthetic — case identification, pre-induction checks, ASA and airway
					assessment, drugs and doses, airway management, monitoring, timed physiological
					observations, fluids and blood loss, regional technique, events and complications, and
					recovery handover, including repeating child lists for drug administrations, timed
					observations, and intra-operative events — and produce a completeness report: status,
					completeness percent, missing mandatory items, and flagged issues, to support a safe,
					auditable record.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the mandatory-item
					completeness rules, and the safety-flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from RCoA GPAS anaesthesia-records guidance, the Association of Anaesthetists
					monitoring standards (2021), the WHO Surgical Safety Checklist (2009), the ASA
					physical-status classification, and Cormack–Lehane grading. A documentation and
					completeness-checking instrument, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
