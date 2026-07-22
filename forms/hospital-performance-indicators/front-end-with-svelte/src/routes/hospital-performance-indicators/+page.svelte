<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the reporting-period wizard and the
	// administrator review dashboard. The collection routes
	// (`/hospital-performance-indicator-reports` and `…/new`) hold the actual
	// functionality.
	const plural = 'hospital-performance-indicator-reports';
</script>

<main class="mx-16 px-4 py-12">

	<h1 class="text-2xl font-bold text-base-content">Hospital Performance Indicators</h1>
	<p class="mt-2 max-w-2xl text-base-content/70">
		A hospital Balanced Scorecard (Kaplan &amp; Norton) KPI report recording 50 strategic
		performance indicators across 4 perspectives.
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<a
			href="/hospital-performance-indicators/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new reporting period</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step scorecard wizard. One continuous single-page form covering the
				reporting period, all 4 Balanced Scorecard perspectives, and sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hospital-performance-indicators/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Administrator review dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reporting periods with their indicators-recorded tally, and filter by hospital and
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
					Capture a hospital Balanced Scorecard (Kaplan &amp; Norton, 1992/1996) KPI report — 50
					concrete strategic-performance indicators across the four classic Balanced Scorecard
					perspectives applied to a hospital (Finance, Process, Learning and Growth, Customer) —
					each recorded as a numeric value with an optional note, and produce a completeness
					tally of indicators recorded grouped by perspective, to seed the report preparer's
					overall notes and sign-off.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec catalogues all 50 indicators, grouped into the 4
					perspectives, with stable dotted identifiers. This is a strategic-performance KPI report,
					not a clinical grading engine — the shared engine only tallies indicators recorded. The
					same engine feeds both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Transcribed from a hospital Balanced Scorecard indicator list. This form is non-clinical
					— a strategic/administrative KPI report, not a patient record.
				</dd>
			</div>
		</dl>
	</section>
</main>
