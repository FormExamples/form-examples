<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Holter Monitor Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Ambulatory ECG (Holter monitor) reporting</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			This wizard lets a cardiologist, cardiac physiologist, or other reporting clinician record what
			an ambulatory ECG recording found, and the shared grading engine then computes a four-axis
			grade — result classification, abnormality severity and structured reporting, report
			completeness, and follow-up urgency — along with safety flags such as an automatic
			critical-result alert.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/holter-monitor-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-step wizard to record recording quality, clinical history, rhythm and
				rate summary, structured findings, impression, and sign-off, and see the computed
				interpretation grade as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/holter-monitor-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded Holter monitor reports, with each row's monitor type alongside the result
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
					Capturing monitor type and recording quality, clinical history, the rhythm and rate summary
					(mean, minimum, and maximum heart rate, longest pause, ectopy burden), and structured
					arrhythmia findings supports accurate ambulatory ECG reporting and prompt recognition of
					life-threatening arrhythmias — sustained ventricular tachycardia, a pause over three
					seconds, high-grade AV block, and fast atrial fibrillation — that warrant urgent specialist
					referral.
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
					Aligned with the ACC/AHA guidelines for ambulatory electrocardiography, the 2017 ISHNE-HRS
					expert consensus on ambulatory ECG and external cardiac monitoring, NICE NG196 (atrial
					fibrillation), and the 2021 ESC guidelines on cardiac pacing.
				</dd>
			</div>
		</dl>
	</section>
</main>
