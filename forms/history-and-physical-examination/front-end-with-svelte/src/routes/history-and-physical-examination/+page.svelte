<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the clerking form and the clinician
	// dashboard.
	const plural = 'history-and-physical-examinations';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			History and Physical Examination
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			H and P — the comprehensive clerking document
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured clinician record of a full history and physical examination, completed as a single
			continuous wizard, that the engine grades <strong>Complete</strong>, <strong>Partial</strong>,
			or <strong>Incomplete</strong> with a completeness percentage rather than a numeric score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/history-and-physical-examination/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new clerking</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step H and P. One continuous single-page wizard that grades documentation
				completeness when you submit it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/history-and-physical-examination/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse clerked patients with their computed completeness status and blocking-flag indicator,
				and filter by completeness and care setting.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture the full clerking — history (presenting complaint, its history, past medical and
					surgical history, drugs and allergies, family and social history, and a systems review),
					vital signs and examination by body system, investigations, an impression, and a
					management plan — and produce a graded report: a complete / partial / incomplete
					classification, a completeness percentage, and flagged issues, two of which (allergies not
					documented; no impression and no plan) are blocking and force an incomplete status, to
					support the admission document and prompt escalation where a safety flag is raised.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness engine, and
					the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Macleod's Clinical Examination, OSCE clerking guides, and the Royal College of
					Physicians NEWS2 vital-sign ranges. A documentation and completeness aid, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
