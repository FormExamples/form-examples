<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Electrocardiogram Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">ECG reports, graded and ready to share</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			The clinician's wizard records what an electrocardiogram (ECG) recording found, and the
			shared grading engine then computes a four-axis interpretation plus safety flags, including
			an automatic critical-result alert for ST-elevation (STEMI), ventricular tachycardia,
			complete heart block, or a markedly prolonged QTc, each implying an urgent same-hour
			communication.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/electrocardiogram-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard — clinical history, rate,
				rhythm and intervals, findings, interpretation, impression, and
				sign-off — to produce a graded cardiology report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/electrocardiogram-test-result/reports"
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
					Capturing structured ECG findings — the ECG type and trace quality, clinical history, the
					ventricular rate, dominant rhythm and PR / QRS / QT / QTc intervals and cardiac axis, and
					findings such as ST elevation or depression, T-wave inversion, pathological Q waves, LVH,
					bundle branch block, and ischaemia — and grading them consistently supports rapid
					identification of time-critical cardiac abnormalities, helping reporting clinicians
					classify rhythm and interval findings correctly, track report completeness, and make sure
					a STEMI pattern, ventricular tachycardia, complete heart block, or markedly prolonged QTc
					triggers an urgent same-hour escalation to the responsible team rather than being missed.
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
					Aligned with the AHA/ACCF/HRS recommendations for the
					standardization and interpretation of the electrocardiogram, the
					Fourth Universal Definition of Myocardial Infarction (2018) STEMI
					ECG criteria, and recognised QTc-prolongation thresholds.
				</dd>
			</div>
		</dl>
	</section>
</main>
