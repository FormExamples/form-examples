<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">CT Scan Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">CT scan report</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			After a CT examination, the reporting clinician records what the scan found, and a shared
			grading engine interprets the report on four independent axes plus safety flags, including
			an automatic critical-result alert for findings such as haemorrhage or a large new infarct.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/ct-scan-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the CT report wizard — examination details, findings, measurements, and
				impression — and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/ct-scan-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded CT reports and filter by Classification and Follow-up urgency to find the
				reports that need attention first.
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
					Capturing the examination and technique performed, clinical history, narrative and
					structured findings (including categories such as ACR Lung-RADS and incidental-findings
					classification), key measurements and radiation dose (dose-length product, DLP), and the
					impression, then grading them on four independent axes — result classification,
					abnormality severity, report completeness, and follow-up urgency — supports early
					recognition of critical imaging findings and helps radiology teams deliver consistent,
					actionable reporting.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data model, the four-axis
					grading engine, and the flag rules, and the same engine grades both the report wizard
					and the reports dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the Royal College of Radiologists (RCR) <em>Standards for the
					interpretation and reporting of imaging investigations</em>, ACR Lung-RADS, the ACR
					Incidental Findings Committee white papers, the ACR Appropriateness Criteria, and the UK
					Ionising Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
				</dd>
			</div>
		</dl>
	</section>
</main>
