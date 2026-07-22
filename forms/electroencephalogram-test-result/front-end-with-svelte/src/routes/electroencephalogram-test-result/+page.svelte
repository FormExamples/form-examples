<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/electroencephalogram-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Work through the seven-section wizard — recording details, clinical
				history, findings, interpretation, impression, and sign-off — to
				produce a graded neurophysiology report.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/electroencephalogram-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded sample reports, filtering by result classification
				(normal / abnormal / critical / inconclusive) and by follow-up
				urgency (routine / recommended / urgent / critical alert).
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
					Capturing structured EEG findings — the recording type, duration, and technical quality,
					clinical history, the background rhythm, and findings such as epileptiform discharges,
					focal or generalised slowing, a recorded seizure, status epilepticus, or a photoparoxysmal
					response — and grading them consistently supports neurophysiology reporting, helping
					reporting clinicians classify background rhythm and epileptiform activity correctly,
					track report completeness, and make sure status epilepticus, a recorded seizure, or
					frequent epileptiform discharges triggers an urgent clinical escalation rather than
					being missed in narrative text.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data
					model, the four-axis grading engine, and the flag rules, and that
					same engine grades both the report wizard and the reports
					dashboard, so the two surfaces never disagree.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the joint IFCN / ILAE minimum recording standards for
					routine, sleep, ambulatory, and video-EEG, the Standardised
					Computer-based Organised Reporting of EEG (SCORE) framework, and
					the ACNS standardized critical-care EEG terminology.
				</dd>
			</div>
		</dl>
	</section>
</main>
