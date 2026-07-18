<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Cardiac Stress Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Cardiac stress test report</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			After a cardiac stress test, the reporting clinician records what the exercise or
			pharmacological stress examination found — the test type and protocol, the clinical
			history, the haemodynamic and exercise response, the structured ECG and symptom findings,
			the overall positive / negative / inconclusive conclusion, and the Duke treadmill
			prognostic score — and a shared grading engine interprets the report on four independent
			axes (result classification, abnormality severity with structured reporting, report
			completeness, and follow-up urgency) plus safety flags, including an automatic
			critical-result alert for findings such as exertional hypotension or a high-risk Duke
			treadmill score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cardiac-stress-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the stress-test report wizard — protocol, haemodynamic response, findings,
				and Duke treadmill score — and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cardiac-stress-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded cardiac stress test reports and filter by Classification and Follow-up
				urgency to find the reports that need attention first.
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
					Capturing stress-test findings and risk stratification (including the Duke treadmill
					score) in a structured form, and grading them consistently, supports early recognition
					of high-risk ischaemia and helps cardiology teams triage follow-up with confidence.
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
					Aligned with the ACC/AHA exercise-testing guidance, the Duke treadmill score prognostic
					risk stratification (Mark et al., <em>Circulation</em>, 1998), the 2024 ESC Guidelines
					for the management of chronic coronary syndromes, and the ACC/AHA/ASE/ASNC/STS
					multimodality appropriate use criteria.
				</dd>
			</div>
		</dl>
	</section>
</main>
