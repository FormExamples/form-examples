<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the evaluation wizard and the review
	// dashboard. The collection routes (`/hip-replacement-surgery-evaluations`
	// and `/hip-replacement-surgery-evaluations/new`) hold the actual
	// functionality.
	const plural = 'hip-replacement-surgery-evaluations';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/hip-replacement-surgery-evaluation/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new evaluation</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step hip-replacement surgery evaluation. One continuous single-page
				wizard across fifteen steps that scores the Oxford Hip Score and computes a
				surgical-candidacy recommendation as you complete it, and saves the draft as you work.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hip-replacement-surgery-evaluation/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded evaluations with their Oxford Hip Score, Kellgren and Lawrence grade,
				surgical-candidacy recommendation, and safety flags, and filter by any of them.
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
					The orthopaedic assessment used to determine whether a patient is a suitable candidate
					for total hip arthroplasty, performed by an orthopaedic surgeon or extended-scope
					physiotherapist in a joint-replacement clinic. It quantifies hip pain and functional
					decline with the Oxford Hip Score, reviews the physical examination and imaging
					findings, audits which conservative measures have been tried, and produces a
					surgical-candidacy recommendation together with a set of safety flags.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Scoring</dt>
				<dd class="mt-1 text-base-content/70">
					The Oxford Hip Score (OHS), a validated 12-item patient-reported outcome measure
					(Dawson et al. 1996), is the primary instrument, 0-48, with 48 the best outcome. The
					surgical-candidacy recommendation is derived from the OHS total, the Kellgren and
					Lawrence radiographic grade, and whether conservative measures are exhausted — which,
					when not exhausted, overrides every other factor. Safety flags are computed
					independently and are never suppressed by a clinician override.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Not another pre-operative assessment</dt>
				<dd class="mt-1 text-base-content/70">
					This form does not compute an ASA grade. Its question is whether this patient's hip
					disease and functional decline justify replacement surgery and whether conservative
					options have been exhausted — not how risky the patient is under anaesthesia. The
					general-fitness step records only a brief screening note.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the scoring engine, and the
					safety-flag rules. The same pure engine grades both the form and the dashboard, and the
					HTML front-end runs an identical implementation.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Status</dt>
				<dd class="mt-1 text-base-content/70">
					Clinical decision support. It does not diagnose and does not replace the clinical
					judgement of the orthopaedic surgeon or extended-scope physiotherapist, who must sign
					the evaluation before the report is final.
				</dd>
			</div>
		</dl>
	</section>
</main>
