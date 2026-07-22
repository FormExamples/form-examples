<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/allergy-skin-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Walk through the seven-section wizard to record an allergy skin test
				result — validity controls, allergens and reactions, and the
				clinician's interpretation — and get a graded report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/allergy-skin-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports and filter by result classification or
				follow-up urgency to find abnormal, critical, or time-sensitive
				results.
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
					Capturing allergy test findings — pre-test validity controls, the allergens tested and
					their measured weal sizes or specific-IgE results, a structured reaction summary, and the
					clinical interpretation and impression — in a structured, consistent format helps
					clinicians distinguish sensitisation from clinically relevant allergy, surfaces
					safety-critical reactions such as anaphylaxis during testing without delay, and produces a
					four-axis graded report — result classification, abnormality severity and structured
					reporting, report completeness, and follow-up urgency — that can be shared reliably with
					referrers and the wider care team.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data
					model, the four-axis grading engine, and the flag rules, and the
					same engine grades both the report wizard and the reports dashboard
					so every surface stays consistent.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with BSACI and EAACI skin-prick and specific-IgE
					interpretation guidance, including the ≥3 mm positive-weal threshold,
					the requirement for a valid positive histamine control, and the
					distinction between sensitisation and clinically relevant allergy.
				</dd>
			</div>
		</dl>
	</section>
</main>
