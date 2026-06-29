<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/genetic-test-requests` and
	// `/genetic-test-requests/new`) hold the actual functionality.
	const plural = 'genetic-test-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Genetic Test Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Clinical genetics / genomic test request
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned genomic test request (referral) that a clinician completes to request a
			genomic test for a patient or family. It records the requested test type, the clinical
			indication and specific question, the clinical details and phenotype, the family history, and
			the consent and pre-test counselling status — then computes a four-axis grading
			(appropriateness, consent &amp; counselling, request completeness, and triage priority) plus
			safety-critical flags to support the Genomic Laboratory Hub's triage and test-selection
			decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the
				request as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed four-axis grades, and filter by triage tier and
				recommendation.
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
					Capture which genomic test is requested, the clinical indication and question, and the
					consent and counselling status, and produce a vetting report the Genomic Laboratory Hub
					can triage and select tests from.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the safety-critical flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the NHS National Genomic Test Directory eligibility criteria and ACGS /
					consent-for-genomic-testing guidance. Consent and pre-test counselling are mandatory for
					predictive / presymptomatic testing.
				</dd>
			</div>
		</dl>
	</section>
</main>
