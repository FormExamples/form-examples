<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hearing-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-step wizard to record test details, clinical history, audiometry and
				interpretation, findings, impression, and sign-off, and see the computed interpretation
				grade as you go.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hearing-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded hearing test reports and filter by result classification (normal, abnormal,
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
					Capturing test reliability, clinical history, per-ear pure-tone averages and hearing-loss type
					and severity (using the British Society of Audiology descriptors), tympanometry, and the
					impression produces a four-axis grade (result classification, abnormality severity and
					structured reporting, report completeness, and follow-up urgency). This supports accurate
					audiology reporting and prompt recognition of sudden sensorineural hearing loss — an
					otological emergency — and marked asymmetry, a red flag for retrocochlear pathology such as
					vestibular schwannoma.
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
					Aligned with the British Society of Audiology recommended procedures and audiometric
					descriptors, NICE NG98 (hearing loss in adults), NICE Quality Standard QS185, and ENT-UK /
					BAO-HNS guidance on sudden sensorineural hearing loss.
				</dd>
			</div>
		</dl>
	</section>
</main>
