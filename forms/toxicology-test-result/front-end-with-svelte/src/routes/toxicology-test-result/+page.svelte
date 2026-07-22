<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/toxicology-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard: specimen and history, result values,
				interpretation, impression, critical communication, and sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/toxicology-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded toxicology reports, filterable by result classification and by
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
					Capturing measured assay levels — paracetamol, salicylate, ethanol, lithium, digoxin,
					carboxyhaemoglobin, a drugs-of-abuse screen, and a named specific drug — alongside a
					structured interpretation gives laboratory and emergency teams a consistent, complete
					record of what an assay found, and flags a toxic result — such as a paracetamol level
					above the treatment line — for urgent antidote action, including starting
					N-acetylcysteine (NAC).
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
					Aligned with TOXBASE / National Poisons Information Service (NPIS) guidance,
					the MHRA paracetamol-overdose treatment nomogram (single 100 mg/L treatment
					line, interpretable only at 4 hours or more post-ingestion), and RCEM
					toxicology best-practice guidance.
				</dd>
			</div>
		</dl>
	</section>
</main>
