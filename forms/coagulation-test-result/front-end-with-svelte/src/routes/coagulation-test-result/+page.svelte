<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Coagulation Test Result</p>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Coagulation test report</h1>
		<p class="mt-4 text-base leading-relaxed text-gray-600">
			After a coagulation / haemostasis test, this report captures the specimen condition,
			clinical history, and result values, then grades them on four independent axes — result
			classification, abnormality severity, report completeness, and follow-up urgency — with an
			automatic critical-result alert for values such as an INR above 8 or a DIC picture.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/coagulation-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the coagulation report wizard — specimen, result values, and impression —
				and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/coagulation-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded coagulation reports and filter by Classification and Follow-up urgency to
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
					Capturing structured coagulation result values — prothrombin time / INR, activated partial
					thromboplastin time / ratio, fibrinogen, D-dimer, thrombin time, and factor assays — and
					grading them consistently supports rapid recognition of critical bleeding-risk values —
					such as a very high INR, a very low fibrinogen, or a DIC picture — and helps haematology
					teams escalate urgent communication and treatment decisions with confidence.
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
					Aligned with the Royal College of Pathologists (RCPath) guidance on the communication of
					critical and unexpected pathology results, British Society for Haematology (BSH)
					guidance on oral anticoagulation with warfarin and on disseminated intravascular
					coagulation, and NICE NG158 (venous thromboembolic diseases).
				</dd>
			</div>
		</dl>
	</section>
</main>
