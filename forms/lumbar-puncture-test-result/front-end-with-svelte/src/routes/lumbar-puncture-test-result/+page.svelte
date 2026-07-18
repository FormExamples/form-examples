<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Lumbar Puncture Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Lumbar puncture / CSF analysis reporting</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			This wizard lets a neurologist, hospital doctor, microbiologist, or other reporting clinician
			record a lumbar puncture's CSF findings and computes a four-axis grade — result classification,
			abnormality severity and structured reporting, report completeness, and follow-up urgency — with
			an automatic critical-result alert for patterns such as bacterial meningitis, suggested
			subarachnoid haemorrhage, or a positive culture.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/lumbar-puncture-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-step wizard to record clinical history, manometry and appearance,
				cell counts and biochemistry, microbiology and specialist tests, interpretation, and
				sign-off, and see the computed interpretation grade as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/lumbar-puncture-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded CSF analysis reports, with each row's CSF pattern alongside the result
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
					Capturing structured CSF findings — manometry opening pressure, appearance, cell counts,
					biochemistry, microbiology, and specialist tests such as oligoclonal bands and xanthochromia
					spectrophotometry — supports accurate lumbar puncture reporting and prompt recognition of
					critical patterns (bacterial meningitis, suggested subarachnoid haemorrhage, or a positive
					culture) that warrant urgent antibiotic or neurosurgical action.
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
					Aligned with NICE NG240 (bacterial meningitis and meningococcal disease), the UK NEQAS
					national guidelines for CSF bilirubin (xanthochromia) analysis in suspected subarachnoid
					haemorrhage, and standard CSF interpretation reference patterns.
				</dd>
			</div>
		</dl>
	</section>
</main>
