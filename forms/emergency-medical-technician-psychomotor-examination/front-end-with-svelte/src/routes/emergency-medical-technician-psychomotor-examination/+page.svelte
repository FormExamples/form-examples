<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the examination form and the training
	// coordinator dashboard. The collection routes hold the actual functionality.
	const plural = 'emergency-medical-technician-psychomotor-examinations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/emergency-medical-technician-psychomotor-examination/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new examination</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step examiner form. One continuous single-page wizard that scores the
				candidate as you mark each item.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/emergency-medical-technician-psychomotor-examination/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Training coordinator dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse graded candidates with their Pass / Fail outcome, points, and critical-criteria
				count, and filter by outcome and attempt.
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
					Capture a structured skills-station record — candidate and scenario details, scene
					size-up, primary survey, history taking and secondary assessment, reassessment, and a
					critical-criteria review — and produce a graded report: Pass / Fail, points achieved,
					critical-criteria failures, and flagged issues, to support objective EMT certification
					and remediation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the checklist data model, the point-based
					grading engine, and the critical-criteria override rules. The same engine grades both the
					form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Mirrors the National Registry of Emergency Medical Technicians (NREMT) Patient Assessment
					psychomotor station: points for performed skills, with critical criteria that force an
					automatic Fail.
				</dd>
			</div>
		</dl>
	</section>
</main>
