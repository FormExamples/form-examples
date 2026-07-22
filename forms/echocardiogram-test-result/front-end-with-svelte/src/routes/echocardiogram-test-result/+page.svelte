<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/echocardiogram-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard — clinical history, LV function
				and dimensions, valves and pressures, structured findings, findings
				and impression, and sign-off — to produce a graded echocardiography
				report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/echocardiogram-test-result/reports"
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
					Capturing the study type and image quality, clinical history, left-ventricular function
					(ejection fraction, qualitative function, internal diameter), valve stenosis and
					regurgitation grades, estimated pulmonary artery systolic pressure, and structured
					findings such as pericardial effusion, vegetation, or intracardiac thrombus, then grading
					them consistently on four independent axes — result classification, abnormality severity
					with a structured reporting category, report completeness, and follow-up urgency —
					supports cardiac-imaging reporting, helping reporting clinicians classify valve disease
					and LV function correctly, track report completeness, and make sure critical findings
					such as a vegetation, large pericardial effusion, or intracardiac thrombus trigger an
					urgent same-day escalation rather than being missed in narrative text.
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
					Aligned with the British Society of Echocardiography (BSE) minimum
					dataset for adult transthoracic echocardiography, the BSE reference
					intervals for cardiac dimensions and function, and the ASE/EACVI
					recommendations for cardiac chamber quantification.
				</dd>
			</div>
		</dl>
	</section>
</main>
