<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/angiography-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Walk through the seven-section wizard to record an angiography
				result — examination details, findings, measurements, and the
				clinician's interpretation — and get a graded report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/angiography-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports and filter by result classification or
				follow-up urgency to find abnormal, critical, or time-sensitive
				results.
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
					Capturing angiography findings — the modality and contrast used, the clinical history, the
					narrative and structured vascular findings, the maximum stenosis percentage, whether an
					intervention was performed, and the clinician's impression — in a structured, consistent
					format helps clinicians grade stenosis severity consistently, surface critical vascular
					findings such as active bleeding or dissection without delay, and produce a four-axis
					graded report — result classification, abnormality severity and structured reporting (a
					NASCET / ECST stenosis-severity category), report completeness, and follow-up urgency —
					that can be shared reliably with referrers and the wider care team.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data
					model, the four-axis grading engine, and the flag rules, and the
					same engine grades both the report wizard and the reports dashboard
					so every surface stays consistent.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the Royal College of Radiologists (RCR) <em>Standards
					for the interpretation and reporting of imaging investigations</em>,
					the ACR Appropriateness Criteria, the NASCET / ECST arterial-stenosis
					grading conventions, and the UK Ionising Radiation (Medical
					Exposure) Regulations 2017 (IR(ME)R).
				</dd>
			</div>
		</dl>
	</section>
</main>
