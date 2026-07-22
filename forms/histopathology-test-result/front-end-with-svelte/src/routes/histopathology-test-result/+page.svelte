<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/histopathology-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-step wizard to record the specimen, clinical history, examination,
				malignancy and staging, impression, and sign-off, and see the computed interpretation grade
				as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/histopathology-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded histopathology reports, with each row's specimen site alongside the result
				classification (normal, abnormal, critical, inconclusive) and follow-up urgency, and filter
				by either axis.
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
					Capturing specimen adequacy, clinical history, macroscopic and microscopic descriptions, the
					diagnosis, and — where malignancy is present — tumour type, histological grade,
					pathological TNM stage, resection margins, and lymphovascular invasion produces structured
					grade and stage core data items. This supports accurate cancer-dataset reporting, informs
					staging, prognosis, and multidisciplinary-team management decisions, and prompts urgent
					escalation of unexpected malignancy or an involved resection margin.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data model, the grading
					engine, and the flag rules, and the same engine grades both the report wizard and the
					reports dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the Royal College of Pathologists' Cancer datasets and tissue pathways and the
					UICC/AJCC TNM Classification of Malignant Tumours, 8th edition, for pathological (pTNM)
					staging.
				</dd>
			</div>
		</dl>
	</section>
</main>
