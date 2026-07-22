<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/blood-cross-match-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the cross-match report wizard — grouping, antibody screen, crossmatch, and
				impression — and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/blood-cross-match-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded cross-match reports and filter by Classification and Follow-up urgency to find
				the reports that need attention first.
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
					Capturing pre-transfusion findings — ABO/RhD group, antibody screen and identification,
					crossmatch outcome, identity-safety checks such as the two-sample rule, and special
					component requirements — in a structured form and grading them consistently supports safe
					blood issue and helps transfusion laboratories catch an incompatible crossmatch, a
					clinically significant antibody, or an ABO discrepancy before a unit is released.
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
					Aligned with British Society for Haematology (BSH) pre-transfusion compatibility guidance,
					NICE NG24 <em>Blood transfusion</em>, and the Serious Hazards of Transfusion (SHOT)
					recommendations on positive patient identification, the two-sample group-check rule, and
					preventing ABO-incompatible transfusion and Wrong Blood in Tube (WBIT). This is the
					result/report counterpart to <code>blood-cross-match-test-request</code>.
				</dd>
			</div>
		</dl>
	</section>
</main>
