<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/pet-scan-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard to record a PET-CT examination and its
				findings, and get the computed four-axis interpretation grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/pet-scan-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports, filterable by result classification and follow-up
				urgency, with scan type, severity, and report-completeness shown per report.
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
					Capturing a structured PET-CT report — most commonly an oncology FDG-PET-CT for
					cancer staging, restaging, or treatment-response assessment — supports consistent
					molecular-imaging interpretation, prompt escalation of critical findings such as
					distant metastasis or progressive disease, and a clear audit trail from
					examination to recommended follow-up.
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
					Aligned to the Royal College of Radiologists' standards for the interpretation and
					reporting of imaging investigations, the Lugano classification / 5-point Deauville
					score for lymphoma, the PERCIST metabolic-response criteria for solid tumours, EANM
					/ SNMMI FDG-PET reporting guidance, and the UK Ionising Radiation (Medical
					Exposure) Regulations 2017 (IR(ME)R).
				</dd>
			</div>
		</dl>
	</section>
</main>
