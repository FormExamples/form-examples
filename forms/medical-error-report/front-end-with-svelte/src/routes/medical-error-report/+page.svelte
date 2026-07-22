<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report form and the patient-safety
	// dashboard. The collection routes (`/medical-error-reports` and
	// `/medical-error-reports/new`) hold the actual functionality.
	const plural = 'medical-error-reports';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/medical-error-report/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new report</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step reporting form. One continuous single-page wizard that classifies the
				incident as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/medical-error-report/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Patient-safety dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reported incidents with their computed WHO severity and overall risk level, and filter
				by risk and severity.
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
					Capture a structured account of a medical error — including contributing factors, root
					cause analysis, and corrective actions — and produce a graded report: WHO severity, NCC
					MERP category, overall risk, and flagged issues to support incident review and
					patient-safety improvement.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the WHO / NCC MERP grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the WHO Severity Scale and the National Coordinating Council for Medication Error
					Reporting and Prevention (NCC MERP) harm categories.
				</dd>
			</div>
		</dl>
	</section>
</main>
