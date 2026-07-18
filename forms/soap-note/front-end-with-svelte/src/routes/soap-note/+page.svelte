<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the SOAP note form and the clinician
	// dashboard.
	const plural = 'soap-notes';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">SOAP Note</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			SOAP Note — a structured clinical progress note
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured clinical progress note that records one patient encounter across the four SOAP
			sections — <strong>S</strong>ubjective, <strong>O</strong>bjective, <strong>A</strong>ssessment,
			and <strong>P</strong>lan — via a single continuous wizard, then grades the note's documentation
			completeness (<strong>Complete</strong>, <strong>Partial</strong>, or
			<strong>Incomplete</strong>) and independently raises safety flags for the clinician.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/soap-note/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new note</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step SOAP note. One continuous single-page wizard that grades completeness as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/soap-note/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse documented encounters with their computed completeness status and safety flags, and
				filter by completeness and care setting.
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
					Record a single encounter across the four SOAP sections and produce a graded report — a
					complete / partial / incomplete classification, a completeness percentage, per-section
					presence, and flagged issues (a missing Assessment or Plan, red-flag symptoms without a
					plan, no safety-netting advice, or abnormal vitals not addressed) — to support the clinical
					record and prompt safety-netting. This is a documentation and completeness instrument, not a
					numeric score: a Complete grade means the note is well documented so another clinician can
					safely continue care, not that the clinical care itself was correct.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness engine, and the
					flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Lawrence Weed's problem-oriented medical record and the widely-taught SOAP
					structure. A documentation and completeness aid, not a diagnosis, a risk score, or a
					substitute for clinical judgement.
				</dd>
			</div>
		</dl>
	</section>
</main>
