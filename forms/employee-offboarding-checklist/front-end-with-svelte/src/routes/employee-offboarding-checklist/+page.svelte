<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the offboarding checklist form and the
	// HR dashboard. The collection routes (`/employee-offboarding-checklists` and
	// `/employee-offboarding-checklists/new`) hold the actual functionality.
	const plural = 'employee-offboarding-checklists';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Employee Offboarding Checklist</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Structured employee offboarding</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured offboarding checklist, completed as a single continuous wizard, that the shared
			engine validates for completeness, returning a Complete / Partial / Incomplete outcome,
			blocking items, and security- and contract-critical flags for HR.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/employee-offboarding-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new checklist</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step offboarding checklist. One continuous single-page wizard that validates
				completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/employee-offboarding-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">HR dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse departing employees with their computed completeness outcome and percentage, and filter
				by outcome and department.
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
					Ensure every departing employee completes the administrative, operational, and
					knowledge-transfer steps required to protect patient safety, organisational data, and service
					continuity — employee details, exit interview, knowledge transfer, equipment return, access
					revocation, final payroll and benefits, references and recommendations, non-disclosure and
					post-employment obligations, forwarding details, and final sign-off — and produce a
					validated completeness report to support exit sign-off.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Offboarding Completeness
					Validation engine, and the flag rules. The same engine validates both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Outcome</dt>
				<dd class="mt-1 text-base-content/70">
					Complete (all mandatory items confirmed and countersigned), Partial (non-blocking items
					outstanding; exit may proceed with waiver), or Incomplete (mandatory item(s) outstanding;
					exit should not proceed without manager escalation).
				</dd>
			</div>
		</dl>
	</section>
</main>
