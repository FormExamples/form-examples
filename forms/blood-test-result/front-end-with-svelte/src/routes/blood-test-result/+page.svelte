<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Blood Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Blood / pathology test report</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			The reporting clinician's wizard records the quantitative analyte results a laboratory
			measured and a structured interpretation, and a shared grading engine turns it into a
			four-axis report grade.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/blood-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the blood report wizard — analyte panels, reference-range interpretation, and
				impression — and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/blood-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded blood reports and filter by Classification and Follow-up urgency to find the
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
					Capturing quantitative analyte results across the common panels — full blood count,
					urea and electrolytes, liver function, inflammation, glycaemic, endocrine, haematinics,
					and coagulation — and interpreting them against laboratory reference ranges and critical
					(panic) values supports timely recognition of results that need urgent clinical action.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data model, the four-axis
					grading engine (result classification, abnormality severity and structured reporting,
					report completeness, follow-up urgency), and the flag rules, and the same engine grades
					both the report wizard and the reports dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the Royal College of Pathologists (RCPath) best-practice recommendations on
					the communication of critical and unexpected pathology results (G158) and with UK
					Pathology Harmony consensus reference ranges. This is the result/report counterpart to
					<code>blood-test-request</code>, mirroring the <code>ct-scan-test-result</code> gold
					template.
				</dd>
			</div>
		</dl>
	</section>
</main>
