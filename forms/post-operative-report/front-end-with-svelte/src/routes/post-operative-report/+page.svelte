<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report form and the clinician
	// dashboard. The collection routes (`/post-operative-reports` and
	// `/post-operative-reports/new`) hold the actual functionality.
	const plural = 'post-operative-reports';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Post-Operative Report</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Structured operation note &amp; complication grading</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured post-operative report, completed as a single continuous wizard covering patient,
			procedure, surgical-team, intra-operative, and recovery details, whose shared engine grades any
			complications with the Clavien-Dindo classification of surgical complications, reports the
			overall (worst) grade, and flags safety-critical issues for the clinical team.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/post-operative-report/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new report</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step operation note. One continuous single-page wizard that grades the
				outcome as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/post-operative-report/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reported operations with their computed Clavien-Dindo grade, complication count, and
				disposition, and filter by grade and disposition.
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
					Document the patient and procedure details, surgical team, intra-operative findings,
					anaesthesia, estimated blood loss and fluid balance, specimens and implants, immediate
					recovery status, complications, and onward plan, then produce a graded report — overall
					Clavien-Dindo grade, per-complication grades, and flagged issues — to support
					post-operative care and clinical governance.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the Clavien-Dindo grading
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the Clavien-Dindo classification of surgical complications (Grade 0 through Grade V),
					grading each complication by the intervention it required.
				</dd>
			</div>
		</dl>
	</section>
</main>
