<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cytology-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard — specimen details, clinical
				history, findings, diagnosis and category, impression, and sign-off —
				to produce a graded cytopathology report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cytology-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports, filtering by result classification
				(normal / abnormal / critical / inconclusive) and by follow-up
				urgency (routine / recommended / urgent / critical alert).
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
					Capturing specimen adequacy, clinical history, the result category and HPV status, the
					microscopic description and diagnosis, the impression, and the recommended follow-up,
					then grading them consistently on four independent axes — result classification,
					abnormality severity with a structured reporting category, report completeness, and
					follow-up urgency — supports NHS cervical screening and cytopathology reporting, helping
					reporting clinicians classify specimens correctly, track report completeness, and make
					sure critical findings such as high-grade dyskaryosis or malignancy trigger urgent
					colposcopy or MDT referral rather than being missed in free text.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data
					model, the four-axis grading engine, and the flag rules, and that
					same engine grades both the report wizard and the reports
					dashboard, so the two surfaces never disagree.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the NHS Cervical Screening Programme (HPV primary
					screening with British Society for Clinical Cytology dyskaryosis
					terminology, which mirrors the Bethesda system), RCPath guidance on
					thyroid cytology (Thy1–Thy5) and breast cytology (C1–C5) reporting,
					the Paris System for Reporting Urinary Cytology, and the
					International System for Reporting Serous Fluid Cytopathology.
				</dd>
			</div>
		</dl>
	</section>
</main>
