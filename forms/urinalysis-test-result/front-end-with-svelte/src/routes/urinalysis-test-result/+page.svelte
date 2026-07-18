<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Urinalysis Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Urinalysis test result</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			A single-page wizard for recording urinalysis findings — specimen condition, dipstick
			(reagent strip) results, microscopy, and culture with antibiotic sensitivities — graded by a
			shared engine into a four-axis interpretation of result classification, abnormality severity,
			report completeness, and follow-up urgency, with an automatic alert for a critical result such
			as significant bacteriuria in pregnancy, a critical organism, or findings suggesting urosepsis.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/urinalysis-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard: specimen, dipstick, microscopy, culture and
				sensitivities, interpretation, and sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/urinalysis-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded urinalysis reports, filterable by result classification and by
				follow-up urgency.
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
					Capturing dipstick, microscopy, and culture findings alongside a structured
					interpretation gives microbiology and pathology teams a consistent, complete
					record of what a urine investigation found, and flags a critical result for
					expedited communication and treatment.
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
					Aligned with the UK Standards for Microbiology Investigations (UK SMI) B41
					Investigation of urine, the Royal College of Pathologists' standards for the
					communication of critical and unexpected pathology results, and NICE NG109
					(lower urinary tract infection).
				</dd>
			</div>
		</dl>
	</section>
</main>
