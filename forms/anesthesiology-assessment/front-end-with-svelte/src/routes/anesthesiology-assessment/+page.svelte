<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard. The collection routes (`/anesthesiology-assessments` and
	// `/anesthesiology-assessments/new`) hold the actual functionality.
	const plural = 'anesthesiology-assessments';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Anesthesiology Assessment</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Pre-operative anaesthesia evaluation</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS-aligned pre-operative anaesthesiology assessment completed as a single continuous
			wizard: demographics, planned surgery, system-by-system medical history, medications,
			allergies, previous anaesthesia, social and functional capacity, vital signs and airway
			examination, investigations, and the anaesthetic plan. The shared engine combines four
			validated instruments — ASA Physical Status, the Mallampati / airway assessment, the Revised
			Cardiac Risk Index (RCRI / Lee), and STOP-BANG (OSA screening) — into one composite
			perioperative risk level and flags safety-critical issues.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/anesthesiology-assessment/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step assessment form. One continuous single-page wizard that grades the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/anesthesiology-assessment/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Anaesthetist dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their ASA / Mallampati classes, RCRI and STOP-BANG scores, and
				composite perioperative risk, and filter by risk and ASA class.
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
					Capture a structured pre-operative profile and produce a graded report — composite
					perioperative risk, ASA / Mallampati / RCRI / STOP-BANG sub-scores, and flagged issues —
					to support the anaesthetist's review and anaesthetic plan.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four scoring instruments,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the ASA Physical Status Classification, the Mallampati airway score, the Revised
					Cardiac Risk Index (Lee Index), and STOP-BANG OSA screening, per AAGBI / RCoA pre-operative
					assessment guidance and NICE NG45.
				</dd>
			</div>
		</dl>
	</section>
</main>
