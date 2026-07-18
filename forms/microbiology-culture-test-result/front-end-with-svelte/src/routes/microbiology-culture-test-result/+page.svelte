<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Microbiology Culture Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Microbiology culture report</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			The wizard lets a consultant microbiologist, biomedical scientist, or infection specialist
			record a processed specimen's culture findings and resistance markers, and the shared
			grading engine computes a four-axis interpretation grade plus safety flags including an
			automatic critical-result alert.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/microbiology-culture-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard to record a microbiology culture and its
				findings, and get the computed four-axis interpretation grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/microbiology-culture-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports, filterable by result classification and follow-up
				urgency, with specimen type, severity, and report-completeness shown per report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-gray-900">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-gray-900">Purpose</dt>
				<dd class="mt-1 text-gray-600">
					Capturing a structured microbiology culture report — Gram stain, organisms isolated
					with colony counts, antibiotic sensitivities, and resistance markers such as MRSA,
					ESBL, and CPE — supports consistent infection interpretation, prompt escalation of
					critical organisms (for example a positive blood culture or CSF isolate), and a
					clear audit trail from specimen to recommended follow-up.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data model, the
					four-axis grading engine, and the flag rules, and the same engine grades both the
					report wizard and the reports dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned to the UKHSA / RCPath UK Standards for Microbiology Investigations (UK
					SMIs) and the Royal College of Pathologists' best-practice recommendation on the
					communication of critical and unexpected pathology results.
				</dd>
			</div>
		</dl>
	</section>
</main>
