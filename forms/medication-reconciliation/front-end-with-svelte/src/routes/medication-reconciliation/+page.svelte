<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the reconciliation wizard and the
	// clinician dashboard.
	const plural = 'medication-reconciliations';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Medication Reconciliation</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Reconcile medicines at a transition of care
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Reconcile a patient's medicines at admission, transfer, or discharge, completed as a single
			continuous wizard. Build the best-possible medication history (BPMH) from two or more
			independent sources, add one row per medicine on the BPMH and the inpatient list, then
			classify every discrepancy and document its intended action and rationale. The shared engine
			derives a completeness status &mdash; Complete, Discrepancies outstanding, or Incomplete
			&mdash; and raises safety flags. This is a documentation-and-completeness instrument, not a
			numeric score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/medication-reconciliation/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new reconciliation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step wizard. One continuous single-page form with repeating editors for
				sources, allergies, medicines, and discrepancies.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/medication-reconciliation/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reconciled patients with their computed status, source and discrepancy counts, and
				safety-flag count, and filter by care setting and status.
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
					Document the reconciliation and produce a graded report &mdash; completeness status,
					per-record counts, and flagged issues &mdash; to support safe transfers of care.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the reconciliation engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Grounded in the WHO High 5s medication-reconciliation standard, NICE NG5, and Royal
					Pharmaceutical Society guidance. A safety prompt, not a diagnosis or a definitive
					interaction checker.
				</dd>
			</div>
		</dl>
	</section>
</main>
