<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the review form and the clinician
	// dashboard.
	const plural = 'heart-failure-reviews';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/heart-failure-review/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new review</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step annual review. One continuous single-page wizard that classifies NYHA
				status, medication optimisation, and completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/heart-failure-review/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse reviewed patients with their computed NYHA status, medication-optimisation status,
				and review completeness, and filter by each.
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
					Capture the annual review — functional status, fluid balance, monitoring bloods, and
					medication optimisation — and produce a graded report: an NYHA functional status, a
					four-pillar medication-optimisation status (ACEi/ARB/ARNI, beta-blocker, MRA, SGLT2
					inhibitor), a review-completeness grade, and flagged issues, to support the QOF
					heart-failure register review and prompt escalation where a safety flag is raised.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the classification engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE NG106, NICE QS9, the NYHA classification, and the 2021 ESC heart-failure
					guidelines. A documentation and status-classification aid, not a diagnosis, and not a
					substitute for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
