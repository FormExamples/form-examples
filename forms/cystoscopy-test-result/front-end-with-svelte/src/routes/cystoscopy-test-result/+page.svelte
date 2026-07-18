<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Cystoscopy Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Cystoscopy report</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			After a cystoscopy, the operating clinician records what the examination of the bladder and
			urethra found, and a shared grading engine interprets the report on four independent axes plus
			safety flags, including an automatic critical-result alert when a bladder tumour or suspicious
			lesion is seen.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cystoscopy-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the cystoscopy report wizard — procedure, findings, tumour and complication,
				and impression — and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cystoscopy-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded cystoscopy reports and filter by Classification and Follow-up urgency to
				find the reports that need attention first.
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
					Capturing the procedure and anaesthesia used, clinical history, narrative and structured
					endoscopic findings, tumour or lesion detail (including size and appearance), and any
					complication, then grading them consistently on four independent axes — result
					classification, abnormality severity, report completeness, and follow-up urgency —
					supports early recognition of a bladder tumour or suspicious lesion and helps urology
					teams apply consistent, risk-stratified surveillance and referral.
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
					Aligned with BAUS / BAUN flexible-cystoscopy guidance and NICE NG2 <em>Bladder cancer:
					diagnosis and management</em>, including its risk-stratified surveillance intervals for
					non-muscle-invasive bladder cancer.
				</dd>
			</div>
		</dl>
	</section>
</main>
