<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Ultrasound Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Ultrasound test result</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			A single-page wizard for recording a general (non-obstetric) diagnostic ultrasound
			examination's details, diagnostic adequacy, structured findings, and largest lesion
			measurement, graded by a shared engine into a four-axis interpretation of result
			classification, abnormality severity, report completeness, and follow-up urgency, with an
			automatic alert for a critical finding such as a DVT, a ruptured or large abdominal aortic
			aneurysm, or signs of testicular torsion.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ultrasound-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard: examination details, clinical history,
				findings, measurements, impression, and sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/ultrasound-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded ultrasound reports, filterable by result classification and by
				follow-up urgency.
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
					Capturing structured findings and measurements alongside a narrative
					interpretation gives radiology and reporting teams a consistent, complete
					record of what a scan found, and flags a critical finding for urgent action
					regardless of how the rest of the report reads.
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
					Aligned with the Royal College of Radiologists' standards for the
					interpretation and reporting of imaging investigations, BMUS / AIUM practice
					guidelines for diagnostic ultrasound, and structured-reporting systems such as
					ACR TI-RADS (thyroid) and the breast U-classification.
				</dd>
			</div>
		</dl>
	</section>
</main>
