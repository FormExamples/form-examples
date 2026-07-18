<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Genetic Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Genomic test result reporting</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			This wizard lets a clinical geneticist, genetic counsellor, or clinical scientist record a
			genomic test’s findings and structured interpretation, which the shared engine grades across
			four axes with an automatic critical-result alert for a pathogenic or likely-pathogenic
			actionable variant.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/genetic-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-step wizard to record the test details, clinical context, variants
				and classification, interpretation, follow-up, and sign-off, and see the computed
				interpretation grade as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/genetic-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded genomic reports and filter by result classification (normal, abnormal,
				critical, inconclusive) or follow-up urgency (routine through critical alert).
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
					Capturing the genes analysed, the clinical history and inheritance pattern, the detected
					variants and their ACMG/AMP (ACGS) five-tier classification, and the interpretation produces a
					four-axis grade (result classification, abnormality severity and structured reporting, report
					completeness, and follow-up urgency). This supports accurate genomic reporting, prompt
					escalation of pathogenic and likely-pathogenic findings, and timely cascade testing for
					at-risk relatives.
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
					Aligned with the ACMG/AMP standards and guidelines for the interpretation of sequence
					variants, the ACGS UK best-practice guidelines for variant classification, CanVIG-UK
					cancer-gene specifications, and the NHS Genomic Medicine Service / National Genomic Test
					Directory.
				</dd>
			</div>
		</dl>
	</section>
</main>
