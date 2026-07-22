<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the reporting-period wizard and the
	// administrator review dashboard. The collection routes
	// (`/hospital-dashboard-metrics-reports` and `…/new`) hold the actual
	// functionality.
	const plural = 'hospital-dashboard-metrics-reports';
</script>

<main class="mx-16 px-4 py-12">

	<h1 class="text-2xl font-bold text-base-content">Hospital Dashboard Metrics</h1>
	<p class="mt-2 max-w-2xl text-base-content/70">
		A periodic hospital KPI dashboard recording 67 operational metrics across 14 departmental
		categories.
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<a
			href="/hospital-dashboard-metrics/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new reporting period</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step metrics wizard. One continuous single-page form covering the
				reporting period, all 14 KPI categories, and sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hospital-dashboard-metrics/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Administrator review dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reporting periods with their metrics-recorded tally, and filter by hospital and
				completeness.
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
					Capture a periodic hospital KPI dashboard — 67 concrete operational metrics across 14
					departmental categories (Antibiotics/Narcotics/Culture Monitoring, Inpatient / Ward,
					Emergency Department, Infection Control, Blood Bank, Outpatient Department, Surgery /
					Operating Room, Pharmacy, Radiology, Patient Flow / Waiting Times, Human Resources,
					Patient Experience, Occurrence Variance Report, and Facilities &amp; Biomedical
					Engineering) — each recorded as a numeric value with an optional note, and produce a
					completeness tally of metrics recorded grouped by category, to seed the report
					preparer's overall notes and sign-off.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec catalogues all 67 metrics, grouped into the 14
					categories, with stable dotted identifiers. This is an operational KPI dashboard, not a
					clinical grading engine — the shared engine only tallies metrics recorded. The same
					engine feeds both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Transcribed from a hospital administration periodic KPI reporting proforma. This form is
					non-clinical — a facility/operations dashboard, not a patient record.
				</dd>
			</div>
		</dl>
	</section>
</main>
